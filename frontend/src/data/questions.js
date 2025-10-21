export const QUESTIONS = [
    {
      id: "SATQ001",
      section: "Reading and Writing",
      type: "Multiple Choice",
      passage: "The following passage is an excerpt from a novel...",
      questionText: "Based on the passage, what is the author's primary purpose?",
      options: [
        { label: "A", text: "To entertain the reader with a compelling narrative." },
        { label: "B", text: "To inform the reader about historical events." },
        { label: "C", text: "To persuade the reader to adopt a particular viewpoint." },
        { label: "D", text: "To describe the setting of a future event." }
      ],
      correctAnswer: "A",
      skillLevel: "medium",
      explanations: {
        long: "This is a detailed explanation of the question, describing why choice A is correct and why the other options are incorrect.",
        short: "A is correct because the author aims to entertain the reader.",
        whyWrong: {
          A: "A is correct, so not wrong.",
          B: "B is incorrect because the passage does not emphasize historical events.",
          C: "C is incorrect because the passage does not try to persuade the reader.",
          D: "D is incorrect because it only describes the setting, not the main purpose."
        }
      },
      metadata: {
        createdBy: "admin01",
        createdAt: "2025-09-18T10:00:00Z",
        updatedAt: "2025-09-18T10:00:00Z",
        tags: ["SAT", "Reading", "Writing"]
      }
    },
  
    {
      id: "SATQ002",
      section: "Math",
      type: "Multiple Choice",
      passage: "",
      questionText: "If 3x + 5 = 20, what is the value of x?",
      options: [
        { label: "A", text: "3" },
        { label: "B", text: "4" },
        { label: "C", text: "5" },
        { label: "D", text: "6" }
      ],
      correctAnswer: "C",
      skillLevel: "easy",
      explanations: {
        long: "Subtract 5 from both sides to get 3x = 15, then divide both sides by 3 to find x = 5.",
        short: "C is correct because x = 5.",
        whyWrong: {
          A: "Incorrect, 3(3)+5=14, not 20.",
          B: "Incorrect, 3(4)+5=17.",
          C: "Correct.",
          D: "Incorrect, 3(6)+5=23."
        }
      },
      metadata: {
        createdBy: "admin02",
        createdAt: "2025-09-19T11:00:00Z",
        updatedAt: "2025-09-19T11:00:00Z",
        tags: ["SAT", "Math", "Algebra"]
      }
    },
  
    {
      id: "SATQ003",
      section: "Math",
      type: "Multiple Choice",
      passage: "",
      questionText: "A line passes through the points (2, 3) and (6, 7). What is its slope?",
      options: [
        { label: "A", text: "1" },
        { label: "B", text: "2" },
        { label: "C", text: "3" },
        { label: "D", text: "4" }
      ],
      correctAnswer: "A",
      skillLevel: "medium",
      explanations: {
        long: "Slope = (7 - 3) / (6 - 2) = 4 / 4 = 1. So the correct answer is A.",
        short: "A is correct because slope = rise/run = 1.",
        whyWrong: {
          A: "Correct.",
          B: "Too steep — slope would be 2 only if rise was 8.",
          C: "Incorrect, rise/run doesn’t equal 3.",
          D: "Incorrect, that’s too large."
        }
      },
      metadata: {
        createdBy: "admin03",
        createdAt: "2025-09-20T09:00:00Z",
        updatedAt: "2025-09-20T09:00:00Z",
        tags: ["SAT", "Math", "Linear"]
      }
    },
  
    {
      id: "SATQ004",
      section: "Reading and Writing",
      type: "Multiple Choice",
      passage:
        "Many scientists argue that the loss of biodiversity could disrupt ecosystems and threaten food security worldwide.",
      questionText: "What is the main idea of the passage?",
      options: [
        { label: "A", text: "Biodiversity loss could impact global ecosystems." },
        { label: "B", text: "Scientists are unconcerned about biodiversity." },
        { label: "C", text: "Food security is unrelated to biodiversity." },
        { label: "D", text: "Ecosystems will remain stable regardless of biodiversity." }
      ],
      correctAnswer: "A",
      skillLevel: "medium",
      explanations: {
        long: "The passage directly links biodiversity loss to ecosystem instability and food insecurity, making A the best answer.",
        short: "A is correct because it summarizes the passage's argument.",
        whyWrong: {
          A: "Correct.",
          B: "Incorrect, scientists are concerned.",
          C: "Incorrect, food security is linked.",
          D: "Incorrect, it contradicts the passage."
        }
      },
      metadata: {
        createdBy: "admin04",
        createdAt: "2025-09-21T12:00:00Z",
        updatedAt: "2025-09-21T12:00:00Z",
        tags: ["SAT", "Reading"]
      }
    },
  
    {
      id: "SATQ005",
      section: "Math",
      type: "Multiple Choice",
      passage: "",
      questionText: "If the area of a circle is 49π, what is its radius?",
      options: [
        { label: "A", text: "7" },
        { label: "B", text: "14" },
        { label: "C", text: "3.5" },
        { label: "D", text: "21" }
      ],
      correctAnswer: "A",
      skillLevel: "easy",
      explanations: {
        long: "Area = πr². So πr² = 49π → r² = 49 → r = 7.",
        short: "A is correct because r = 7.",
        whyWrong: {
          A: "Correct.",
          B: "Incorrect, area would be much larger.",
          C: "Incorrect, area would be smaller.",
          D: "Incorrect, too large."
        }
      },
      metadata: {
        createdBy: "admin05",
        createdAt: "2025-09-22T08:00:00Z",
        updatedAt: "2025-09-22T08:00:00Z",
        tags: ["SAT", "Geometry"]
      }
    },
  
    {
      id: "SATQ006",
      section: "Reading and Writing",
      type: "Multiple Choice",
      passage:
        "In the early 20th century, advancements in transportation revolutionized how people and goods moved across continents.",
      questionText: "Which choice best describes the effect of transportation advancements?",
      options: [
        { label: "A", text: "They slowed global communication." },
        { label: "B", text: "They increased isolation between regions." },
        { label: "C", text: "They revolutionized trade and connectivity." },
        { label: "D", text: "They reduced the use of technology." }
      ],
      correctAnswer: "C",
      skillLevel: "hard",
      explanations: {
        long: "Advancements in transportation increased global connectivity, enabling trade and movement of goods across continents.",
        short: "C is correct because the passage highlights global connectivity.",
        whyWrong: {
          A: "Incorrect, the opposite is true.",
          B: "Incorrect, it increased connection.",
          C: "Correct.",
          D: "Incorrect, it increased technology use."
        }
      },
      metadata: {
        createdBy: "admin06",
        createdAt: "2025-09-23T14:00:00Z",
        updatedAt: "2025-09-23T14:00:00Z",
        tags: ["SAT", "Reading", "History"]
      }
    }
  ];
  