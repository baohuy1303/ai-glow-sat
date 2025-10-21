import { useState } from "react";
import { QUESTIONS } from "../data/questions";
import Navbar from "../components/Navbar";

export default function QuestionBank() {
  const [filters, setFilters] = useState({
    section: "",
    skillLevel: "",
  });

  const filteredQuestions = QUESTIONS.filter((q) => {
    const matchesSection =
      !filters.section || q.section === filters.section;
    const matchesSkill =
      !filters.skillLevel || q.skillLevel === filters.skillLevel;
    return matchesSection && matchesSkill;
  });

  return (
    <div className="min-h-screen bg-[#f3f4ff] text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="px-16 py-10">
        <h1 className="text-4xl font-extrabold text-center mb-10">
          SAT QUESTION BANK
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <select
            className="px-5 py-3 rounded-full border border-gray-300 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5B00D2]"
            value={filters.section}
            onChange={(e) =>
              setFilters({ ...filters, section: e.target.value })
            }
          >
            <option value="">All Sections</option>
            <option>Reading and Writing</option>
            <option>Math</option>
          </select>

          <select
            className="px-5 py-3 rounded-full border border-gray-300 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5B00D2]"
            value={filters.skillLevel}
            onChange={(e) =>
              setFilters({ ...filters, skillLevel: e.target.value })
            }
          >
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mx-auto max-w-6xl">
          <table className="min-w-full border-collapse rounded-lg overflow-hidden bg-white shadow">
            <thead className="bg-[#f6f4ff] border-b-2 border-[#5B00D2]">
              <tr className="text-left">
                <th className="p-4 font-bold">ID</th>
                <th className="p-4 font-bold">Section</th>
                <th className="p-4 font-bold">Skill Level</th>
                <th className="p-4 font-bold">Question</th>
                <th className="p-4 font-bold">Answer</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{q.id}</td>
                  <td className="p-4">{q.section}</td>
                  <td className="p-4 capitalize">{q.skillLevel}</td>
                  <td className="p-4">{q.questionText}</td>
                  <td className="p-4 font-semibold text-green-700">
                    {q.correctAnswer}
                  </td>
                </tr>
              ))}

              {filteredQuestions.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500 italic"
                  >
                    No questions found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
