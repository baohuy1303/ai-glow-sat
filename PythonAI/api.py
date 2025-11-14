import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.document_loaders import PyPDFLoader
from pydantic import BaseModel, Field, RootModel
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from enum import Enum
from typing import List, Optional
import json
import tempfile
import redis
from datetime import datetime

# Initialize FastAPI app
app = FastAPI(title="AI Glow SAT Question Parser")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Redis
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# Initialize OpenAI
llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"), model_name="gpt-4o-mini", temperature=0.0)

# Enums and Models (from your main.py)
class Section(str, Enum):
    READING_AND_WRITING = "reading_and_writing"
    MATH = "math"

class Domain(str, Enum):
    INFORMATION_AND_IDEAS = "information_and_ideas"
    CRAFT_AND_STRUCTURE = "craft_and_structure"
    EXPRESS_OF_IDEAS = "expression_of_ideas"
    STANDARD_ENGLISH_CONVENTIONS = "standard_english_conventions"
    ALGEBRA = "algebra"
    ADVANCED_MATH = "advanced_math"
    PROBLEM_SOLVING_AND_DATA_ANALYSIS = "problem_solving_and_data_analysis"
    GEOMETRY_AND_TRIGONOMETRY = "geometry_and_trigonometry"

class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    SHORT_ANSWER = "short_answer"

class Skill(str, Enum):
    COMMAND_OF_EVIDENCE_TEXTUAL = "command_of_evidence_textual"
    COMMAND_OF_EVIDENCE_QUANTITATIVE = "command_of_evidence_quantitative"
    CENTRAL_IDEAS_AND_DETAILS = "central_ideas_and_details"
    INFERENCES = "inferences"
    WORD_IN_CONTEXT = "word_in_context"
    TEXT_STRUCTURE_AND_PURPOSE = "text_structure_and_purpose"
    CROSS_TEXT_CONNECTIONS = "cross_text_connections"
    TRANSITIONS = "transitions"
    RHETORICAL_SYNTHESIS = "rhetorical_synthesis"
    BOUNDARIES = "boundaries"
    FORM_STRUCTURE_AND_SENSE = "form_structure_and_sense"
    LINEAR_EQUATIONS_IN_ONE_VARIABLE = "linear_equations_in_one_variable"
    LINEAR_FUNCTIONS = "linear_functions"
    LINEAR_EQUATIONS_IN_TWO_VARIABLES = "linear_equations_in_two_variables"
    SYSTEMS_OF_TWO_LINEAR_EQUATIONS_IN_TWO_VARIABLES = "systems_of_two_linear_equations_in_two_variables"
    LINEAR_INEQUALITIES_IN_ONE_OR_TWO_VARIABLES = "linear_inequalities_in_one_or_two_variables"
    NONLINEAR_FUNCTIONS = "nonlinear_functions"
    NONLINEAR_EQUATIONS_IN_ONE_VARIABLE_AND_SYSTEMS_OF_EQUATIONS_IN_TWO_VARIABLES = "nonlinear_equations_in_one_variable_and_systems_of_equations_in_two_variables"
    EQUIVALENT_EXPRESSIONS = "equivalent_expressions"
    RATIOS_RATES_PROPORTIONAL_RELATIONSHIPS_AND_UNITS = "ratios_rates_proportional_relationships_and_units"
    PERCENTAGES = "percentages"
    ONE_VARIABLE_DATA_DISTRIBUTIONS_AND_MEASURES_OF_CENTER_AND_SPREAD = "one_variable_data_distributions_and_measures_of_center_and_spread"
    TWO_VARIABLE_DATA_MODELS_AND_SCATTERPLOTS = "two_variable_data_models_and_scatterplots"
    PROBABILITY_AND_CONDITIONAL_PROBABILITY = "probability_and_conditional_probability"
    INFERENCE_FROM_SAMPLE_STATISTICS_AND_MARGIN_OF_ERROR = "inference_from_sample_statistics_and_margin_of_error"
    EVALUATING_STATISTICAL_CLAIMS_OBSERVATIONAL_STUDIES_AND_EXPERIMENTS = "evaluating_statistical_claims_observational_studies_and_experiments"
    AREA_AND_VOLUME = "area_and_volume"
    LINES_ANGLES_AND_TRIANGLES = "lines_angles_and_triangles"
    RIGHT_TRIANGLES_AND_TRIGONOMETRY = "right_triangles_and_trigonometry"
    CIRCLES = "circles"

class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class Option(BaseModel):
    label: str = Field(..., description="Option label (e.g., A, B, C, D)")
    text: str = Field(..., description="Text content of the option")
    explanation: Optional[str] = Field(None, description="Explanation for the option")

class Question(BaseModel):
    section: Section = Field(..., description="Question section name or category")
    domain: Optional[Domain] = Field(None, description="The domain or topic of the question")
    skill: Optional[Skill] = Field(None, description="The skill tested by the question")
    difficulty: Optional[Difficulty] = Field(None, description="The difficulty level of the question")
    type: Optional[QuestionType] = Field(None, description="The type of question")
    passage: Optional[str] = Field(None, description="Associated passage or text for the question")
    imagePage: Optional[str] = Field(None, description="Page number of the image on the pdf if question contains an image")
    questionText: str = Field(..., description="Main question text")
    options: Optional[List[Option]] = Field(None, description="List of answer options")
    correctAnswer: Optional[str] = Field(None, description="Correct answer label or text")

class QuestionsList(RootModel[List[Question]]):
    root: List[Question]

# Initialize parser and prompt
parser = JsonOutputParser(pydantic_object=QuestionsList)

prompt = PromptTemplate(
    template=(
        "You are a question parser and classifier. Your task is to extract SAT-style questions "
        "from the given text and fill in missing fields by reasoning from the question and passage.\n\n"
        "Important: The text may contain content from multiple pages. Questions and passages may span "
        "across page boundaries. Make sure to extract complete questions even if they are split across pages.\n\n"
        "Instructions:\n"
        "- Extract all questions in the text, including those that span multiple pages.\n"
        "- If the PDF does not specify a field (like domain, skill, difficulty, etc.), infer it logically.\n"
        "- For 'difficulty', use EASY, MEDIUM, or HARD depending on the question complexity.\n"
        "- If the question does NOT include a passage (common in math), set 'passage' to null.\n"
        "- If the question is short-answer (no options), set `type` to 'short_answer' and `options` to null.\n"
        "- If the question is multiple-choice, extract all answer choices (A, B, C, D, etc.).\n"
        "- If no correct answer is given, predict the most likely correct one based on reasoning.\n"
        "- If explanations are missing, generate short explanations for each option.\n"
        "- If the passage refers to an image, include `imagePage` as the page number, else set to null.\n\n"
        "{format_instructions}\n\n"
        "Text:\n{context}"
    ),
    input_variables=["context"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

chain = prompt | llm | parser

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "AI Glow FastAPI is running", "version": "1.0.0"}

@app.post("/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    """
    Parse PDF file and extract SAT questions
    Store in Redis and return parsed data
    """
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name
        
        # Load and process PDF
        loader = PyPDFLoader(tmp_path)
        pages = loader.load()
        
        # Concatenate all pages into a single document
        # Use page separators to help maintain context
        combined_content = "\n\n--- Page Break ---\n\n".join(
            [f"Page {i+1}:\n{page.page_content}" for i, page in enumerate(pages)]
        )
        
        # Parse all pages at once to avoid cutting off questions at page boundaries
        result = chain.invoke({"context": combined_content})
        questions: QuestionsList = result
        all_questions = list(questions)
        
        # Convert to JSON
        questions_json = json.dumps(all_questions, ensure_ascii=False, indent=2)
        
        # Store in Redis with filename as key
        redis_key = f"parsed:{file.filename}"
        redis_client.set(redis_key, questions_json)
        redis_client.expire(redis_key, 3600)  # Expire in 1 hour
        
        # Clean up temp file
        os.unlink(tmp_path)
        
        return {
            "success": True,
            "filename": file.filename,
            "redis_key": redis_key,
            "questions_count": len(all_questions),
            "questions": all_questions,
            "message": f"Successfully parsed {len(all_questions)} questions and stored in Redis"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.get("/redis/{key}")
async def get_from_redis(key: str):
    """
    Retrieve data from Redis by key
    """
    try:
        data = redis_client.get(key)
        if data is None:
            raise HTTPException(status_code=404, detail="Key not found in Redis")
        
        return {
            "success": True,
            "key": key,
            "data": json.loads(data)
        }
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON data in Redis")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving from Redis: {str(e)}")

@app.delete("/redis/{key}")
async def delete_from_redis(key: str):
    """
    Delete data from Redis by key
    """
    try:
        result = redis_client.delete(key)
        if result == 0:
            raise HTTPException(status_code=404, detail="Key not found in Redis")
        
        return {
            "success": True,
            "message": f"Key '{key}' deleted from Redis"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting from Redis: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

