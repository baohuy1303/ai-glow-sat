import os
from dotenv import load_dotenv
load_dotenv()
from langchain_community.document_loaders import PyPDFLoader
from pydantic import BaseModel, Field, RootModel
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from enum import Enum
from typing import List, Optional

llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"), model_name="gpt-5-nano", temperature=0.0)



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
    explanation: Optional[str] = Field(None, description="Explanation for the option if available")

class Question(BaseModel):
    section: str = Field(..., description="Question section name or category")
    domain: Optional[Domain] = Field(None, description="The domain or topic of the question")
    skill: Optional[Skill] = Field(None, description="The skill tested by the question")
    difficulty: Optional[Difficulty] = Field(None, description="The difficulty level of the question")
    type: QuestionType = Field(description="The type of question")
    passage: str = Field(..., description="Associated passage or text for the question")
    imagePage: Optional[str] = Field(None, description="Page number of the image on the pdf if question contains an image") 
    questionText: str = Field(..., description="Main question text")
    options: Optional[List[Option]] = Field(None, description="List of answer options")
    correctAnswer: str = Field(..., description="Correct answer label or text")

class QuestionsList(RootModel[List[Question]]):
    root: List[Question]

parser = JsonOutputParser(pydantic_object=QuestionsList)

def load_pdf():
    loader = PyPDFLoader("TestData/TestPDFP1.pdf")
    pages = loader.load()

    return pages

prompt = PromptTemplate(
    template="Extract all questions from the following text. Return the questions in a list of questions. \n{format_instructions}\n{context}",
    input_variables=["context"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

pages = load_pdf()

chain = prompt | llm | parser

results = []

for page in pages:
    result = chain.invoke({"context": page.page_content})
    print(result)
    questions : QuestionsList = result
    results.extend(questions)

print(results)

#print(result)