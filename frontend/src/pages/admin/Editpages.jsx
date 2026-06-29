import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../utilis/axiosClient";

const EditProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    startcode: [{ language: "", initialcode: "" }],
    drivercode: [{ language: "", importcode: "", maincode: "" }],
    referencesolution: [{ language: "", initialcode: "" }],
    visibleTestCases: [{ displayInput: "", input: "", output: "", explanation: "" }],
    hiddenTestCases: [{ displayInput: "", input: "", output: "" }],
  });

  const [dbDriverCodes, setDbDriverCodes] = useState([]);
  const [dbReferenceSolutions, setDbReferenceSolutions] = useState([]);
  const [dbStartCodes, setDbStartCodes] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");

  const availableLanguages = [
    { value: "cpp", label: "C++" },
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
    { value: "c", label: "C" },
  ];

  // Fetch existing problem
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/problembyid/${id}`);
        const data = res.data;

        // Store database driver codes and reference solutions
        setDbDriverCodes(data?.drivercode || []);
        setDbReferenceSolutions(data?.referencesolution || []);
        setDbStartCodes(data?.startcode || []);

        // Initialize with default selected language (cpp)
        const defaultLang = "cpp";
        const dbStartCode = (data?.startcode || []).find((code) => code.language === defaultLang);
        const dbDriverCode = (data?.drivercode || []).find((code) => code.language === defaultLang);
        const dbRefSolution = (data?.referencesolution || []).find((code) => code.language === defaultLang);

        setFormData({
          title: data?.title || "",
          description: data?.description || "",
          difficulty: data?.difficulty || "",
          startcode: [{
            language: defaultLang,
            initialcode: dbStartCode?.initialcode || "",
          }],
          drivercode: [{
            language: defaultLang,
            importcode: dbDriverCode?.importcode || "",
            maincode: dbDriverCode?.maincode || "",
          }],
          referencesolution: [{
            language: defaultLang,
            initialcode: dbRefSolution?.initialcode || "",
          }],
          visibleTestCases: data?.visibleTestCases?.length
            ? data.visibleTestCases
            : [{ input: "", output: "", explanation: "" }],
          hiddenTestCases: data?.hiddenTestCases?.length
            ? data.hiddenTestCases
            : [{ input: "", output: "" }],
        });
      } catch (err) {
        console.log("Error fetching problem:", err);
      }
    };
    fetchProblem();
  }, [id]);

  // Handle text fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle visible/hidden test changes
  const handleTestChange = (type, index, field, value) => {
    const updatedTests = [...formData[type]];
    updatedTests[index][field] = value;
    setFormData({ ...formData, [type]: updatedTests });
  };

  // Add or delete test cases
  const addTestCase = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { displayInput: "", input: "", output: "", explanation: "" }],
    });
  };

  const removeTestCase = (type, index) => {
    const updated = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updated });
  };

  // Handle code changes for startcode and referencesolution
  const handleCodeChange = (type, index, field, value) => {
    const updatedCode = [...formData[type]];
    updatedCode[index][field] = value;
    setFormData({ ...formData, [type]: updatedCode });
  };

  // Add or remove code entries
  const addCodeEntry = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { language: "", initialcode: "" }],
    });
  };

  const removeCodeEntry = (type, index) => {
    const updated = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updated });
  };

  // Handle starter code language selection - render if exists in db, otherwise leave empty
  const handleLanguageTabChange = (language) => {
    setSelectedLanguage(language);
    
    // Update startcode for the selected language
    const dbStartCode = dbStartCodes.find((code) => code.language === language);
    const updatedStartCode = [...formData.startcode];
    updatedStartCode[0] = {
      language: language,
      initialcode: dbStartCode?.initialcode || "",
    };
    
    // Update drivercode for the selected language
    const dbDriverCode = dbDriverCodes.find((code) => code.language === language);
    const updatedDriverCode = [...formData.drivercode];
    updatedDriverCode[0] = {
      language: language,
      importcode: dbDriverCode?.importcode || "",
      maincode: dbDriverCode?.maincode || "",
    };
    
    // Update referencesolution for the selected language
    const dbRefSolution = dbReferenceSolutions.find((code) => code.language === language);
    const updatedRefSolution = [...formData.referencesolution];
    updatedRefSolution[0] = {
      language: language,
      initialcode: dbRefSolution?.initialcode || "",
    };
    
    setFormData({
      ...formData,
      startcode: updatedStartCode,
      drivercode: updatedDriverCode,
      referencesolution: updatedRefSolution,
    });
  };

  // Handle starter code language selection - render if exists in db, otherwise leave empty
  const handleStartCodeLanguageChange = (index, language) => {
    const dbCode = dbStartCodes.find((code) => code.language === language);
    
    const updatedCode = [...formData.startcode];
    updatedCode[index] = {
      language: language,
      initialcode: dbCode?.initialcode || "",
    };
    
    setFormData({ ...formData, startcode: updatedCode });
  };

  // Handle driver code language selection - render if exists in db, otherwise leave empty
  const handleDriverCodeLanguageChange = (index, language) => {
    const dbCode = dbDriverCodes.find((code) => code.language === language);
    
    const updatedCode = [...formData.drivercode];
    updatedCode[index] = {
      language: language,
      importcode: dbCode?.importcode || "",
      maincode: dbCode?.maincode || "",
    };
    
    setFormData({ ...formData, drivercode: updatedCode });
  };

  // Handle reference solution language selection - render if exists in db, otherwise leave empty
  const handleReferenceSolutionLanguageChange = (index, language) => {
    // Search for this language in the database reference solutions
    const dbSolution = dbReferenceSolutions.find(
      (code) => code.language === language
    );
    
    const updatedCode = [...formData.referencesolution];
    updatedCode[index] = {
      language: language,
      initialcode: dbSolution?.initialcode || "",
    };
    
    setFormData({ ...formData, referencesolution: updatedCode });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/problem/update/${id}`, formData);
      alert("✅ Problem updated successfully!");
      navigate("/admin");
    } catch (err) {
      console.log("Error updating problem:", err);
      alert(err.response?.data?.message || "Error updating problem");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#1e1e1e] p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-xl sm:text-2xl font-bold text-[#f89f1b] mb-4">
        ✏️ Edit Problem
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-400 mb-1">Problem Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-400 mb-1">
            Problem Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          ></textarea>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-gray-400 mb-1">Difficulty Level</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          >
            <option value="">Select</option>
            <option value="easy">🟢 Easy</option>
            <option value="medium">🟠 Medium</option>
            <option value="hard">🔴 Hard</option>
          </select>
        </div>

        {/* Language Tabs */}
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-3">
            💻 Code Sections (by Language)
          </h3>
          
          {/* Language Tabs */}
          <div className="flex gap-2 mb-4 border-b border-gray-700 overflow-x-auto pb-2">
            {availableLanguages.map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => handleLanguageTabChange(lang.value)}
                className={`px-3 sm:px-4 py-2 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base ${
                  selectedLanguage === lang.value
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Starter Code for selected language */}
          <div className="mb-6">
            <h4 className="text-base sm:text-lg font-semibold text-green-400 mb-2">
              Starter Code
            </h4>
            <div className="border border-gray-700 p-2 sm:p-3 rounded bg-gray-900">
              <textarea
                value={formData.startcode[0]?.initialcode || ""}
                onChange={(e) =>
                  handleCodeChange("startcode", 0, "initialcode", e.target.value)
                }
                rows="8"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 font-mono text-sm"
                placeholder={`Enter starter code for ${availableLanguages.find(l => l.value === selectedLanguage)?.label}...`}
              ></textarea>
            </div>
          </div>

          {/* Driver Code for selected language */}
          <div className="mb-6">
            <h4 className="text-base sm:text-lg font-semibold text-indigo-400 mb-2">
              Driver Code (Hidden)
            </h4>
            <div className="border border-gray-700 p-2 sm:p-3 rounded bg-gray-900">
              <label className="block text-gray-400 text-xs sm:text-sm mb-1">
                Top code (imports, using directives, etc.)
              </label>
              <textarea
                value={formData.drivercode[0]?.importcode || ""}
                onChange={(e) =>
                  handleCodeChange("drivercode", 0, "importcode", e.target.value)
                }
                rows="4"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-3 font-mono text-sm"
                placeholder="Enter imports and class definition..."
              ></textarea>

              <label className="block text-gray-400 text-xs sm:text-sm mb-1">
                Bottom code (int main / runner that uses Solution)
              </label>
              <textarea
                value={formData.drivercode[0]?.maincode || ""}
                onChange={(e) =>
                  handleCodeChange("drivercode", 0, "maincode", e.target.value)
                }
                rows="12"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 font-mono text-sm"
                placeholder="Enter main function or runner code..."
              ></textarea>
            </div>
          </div>

          {/* Reference Solution for selected language */}
          <div className="mb-6">
            <h4 className="text-base sm:text-lg font-semibold text-yellow-400 mb-2">
              Reference Solution
            </h4>
            <div className="border border-gray-700 p-2 sm:p-3 rounded bg-gray-900">
              <textarea
                value={formData.referencesolution[0]?.initialcode || ""}
                onChange={(e) =>
                  handleCodeChange("referencesolution", 0, "initialcode", e.target.value)
                }
                rows="12"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 font-mono text-sm"
                placeholder={`Enter reference solution for ${availableLanguages.find(l => l.value === selectedLanguage)?.label}...`}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Start Code */}
        <div style={{ display: "none" }}>
          <h3 className="text-xl font-semibold text-green-400 mb-2">
            💻 Starter Code
          </h3>
          {formData.startcode.map((code, index) => (
            <div
              key={index}
              className="border border-gray-700 p-3 rounded mb-2 bg-gray-900"
            >
              <label className="block text-gray-400 text-sm mb-1">
                Language
              </label>
              <select
                value={code.language}
                onChange={(e) =>
                  handleStartCodeLanguageChange(index, e.target.value)
                }
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
                required
              >
                <option value="">Select Language</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="c">C</option>
              </select>

              <label className="block text-gray-400 text-sm mb-1">
                Initial Code
              </label>
              <textarea
                value={code.initialcode}
                onChange={(e) =>
                  handleCodeChange(
                    "startcode",
                    index,
                    "initialcode",
                    e.target.value
                  )
                }
                rows="6"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2 font-mono"
              ></textarea>

              {formData.startcode.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCodeEntry("startcode", index)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  ❌ Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addCodeEntry("startcode")}
            className="text-green-400 hover:text-green-600 text-sm"
          >
            ➕ Add Starter Code
          </button>
        </div>

        {/* Driver Code (hidden) */}
        <div style={{ display: "none" }}>
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">
            🚘 Driver Code (hidden)
          </h3>
          {formData.drivercode.map((code, index) => (
            <div
              key={index}
              className="border border-gray-700 p-3 rounded mb-2 bg-gray-900"
            >
              <label className="block text-gray-400 text-sm mb-1">
                Language
              </label>
              <select
                value={code.language}
                onChange={(e) =>
                  handleDriverCodeLanguageChange(index, e.target.value)
                }
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
              >
                <option value="">Select Language</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="c">C</option>
              </select>

              <label className="block text-gray-400 text-sm mb-1">
                Top code (imports, using directives, etc.)
              </label>
              <textarea
                value={code.importcode || ""}
                onChange={(e) =>
                  handleCodeChange(
                    "drivercode",
                    index,
                    "importcode",
                    e.target.value
                  )
                }
                rows="3"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2 font-mono"
              ></textarea>

              <label className="block text-gray-400 text-sm mb-1">
                Bottom code (int main / runner that uses Solution)
              </label>
              <textarea
                value={code.maincode || ""}
                onChange={(e) =>
                  handleCodeChange(
                    "drivercode",
                    index,
                    "maincode",
                    e.target.value
                  )
                }
                rows="4"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2 font-mono"
              ></textarea>

              {formData.drivercode.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCodeEntry("drivercode", index)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  ❌ Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addCodeEntry("drivercode")}
            className="text-indigo-400 hover:text-indigo-600 text-sm"
          >
            ➕ Add Driver Code
          </button>
        </div>

        {/* Reference Solution */}
        <div style={{ display: "none" }}>
          <h3 className="text-xl font-semibold text-yellow-400 mb-2">
            ✅ Reference Solution
          </h3>
          {formData.referencesolution.map((code, index) => (
            <div
              key={index}
              className="border border-gray-700 p-3 rounded mb-2 bg-gray-900"
            >
              <label className="block text-gray-400 text-sm mb-1">
                Language
              </label>
              <select
                value={code.language}
                onChange={(e) =>
                  handleReferenceSolutionLanguageChange(index, e.target.value)
                }
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
                required
              >
                <option value="">Select Language</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="c">C</option>
              </select>

              <label className="block text-gray-400 text-sm mb-1">
                Reference Code
              </label>
              <textarea
                value={code.initialcode}
                onChange={(e) =>
                  handleCodeChange(
                    "referencesolution",
                    index,
                    "initialcode",
                    e.target.value
                  )
                }
                rows="6"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2 font-mono"
              ></textarea>

              {formData.referencesolution.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCodeEntry("referencesolution", index)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  ❌ Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addCodeEntry("referencesolution")}
            className="text-yellow-400 hover:text-yellow-600 text-sm"
          >
            ➕ Add Reference Solution
          </button>
        </div>

        {/* Visible Test Cases */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-2">
            🌟 Visible Test Cases
          </h3>
          {formData.visibleTestCases.map((test, index) => (
            <div
              key={index}
              className="border border-gray-700 p-2 sm:p-3 rounded mb-2 bg-gray-900"
            >
              <label className="block text-green-400 text-xs sm:text-sm font-semibold mb-1">
                Display Input (User-friendly format)
              </label>
              <textarea
                value={test.displayInput || ""}
                onChange={(e) =>
                  handleTestChange(
                    "visibleTestCases",
                    index,
                    "displayInput",
                    e.target.value
                  )
                }
                rows="2"
                placeholder="e.g., nums = [2, 7, 11, 15], target = 9"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
              ></textarea>

              <label className="block text-blue-400 text-xs sm:text-sm font-semibold mb-1">
                Actual Input (Backend format)
              </label>
              <textarea
                value={test.input}
                onChange={(e) =>
                  handleTestChange(
                    "visibleTestCases",
                    index,
                    "input",
                    e.target.value
                  )
                }
                rows="2"
                placeholder="e.g., 4 2 7 11 15 9"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
              ></textarea>

              <label className="block text-yellow-400 text-xs sm:text-sm font-semibold mb-1">
                Expected Output
              </label>
              <textarea
                value={test.output}
                onChange={(e) =>
                  handleTestChange(
                    "visibleTestCases",
                    index,
                    "output",
                    e.target.value
                  )
                }
                rows="2"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2 text-sm"
              ></textarea>

              <label className="block text-purple-400 text-xs sm:text-sm font-semibold mb-1">
                Explanation
              </label>
              <textarea
                value={test.explanation || ""}
                onChange={(e) =>
                  handleTestChange(
                    "visibleTestCases",
                    index,
                    "explanation",
                    e.target.value
                  )
                }
                rows="2"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2 text-sm"
              ></textarea>

              {formData.visibleTestCases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestCase("visibleTestCases", index)}
                  className="text-red-400 hover:text-red-600 text-xs sm:text-sm"
                >
                  ❌ Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addTestCase("visibleTestCases")}
            className="text-blue-400 hover:text-blue-600 text-xs sm:text-sm"
          >
            ➕ Add Visible Test Case
          </button>
        </div>

        {/* Hidden Test Cases */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-purple-400 mb-2">
            🕵️ Hidden Test Cases
          </h3>
          {formData.hiddenTestCases.map((test, index) => (
            <div
              key={index}
              className="border border-gray-700 p-2 sm:p-3 rounded mb-2 bg-gray-900"
            >
              <label className="block text-green-400 text-xs sm:text-sm font-semibold mb-1">
                Display Input (User-friendly format)
              </label>
              <textarea
                value={test.displayInput || ""}
                onChange={(e) =>
                  handleTestChange(
                    "hiddenTestCases",
                    index,
                    "displayInput",
                    e.target.value
                  )
                }
                rows="2"
                placeholder="e.g., nums = [2, 7, 11, 15], target = 9"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2 text-sm"
              ></textarea>

              <label className="block text-blue-400 text-xs sm:text-sm font-semibold mb-1">
                Actual Input (Backend format)
              </label>
              <textarea
                value={test.input}
                onChange={(e) =>
                  handleTestChange(
                    "hiddenTestCases",
                    index,
                    "input",
                    e.target.value
                  )
                }
                rows="2"
                placeholder="e.g., 4 2 7 11 15 9"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2 text-sm"
              ></textarea>

              <label className="block text-yellow-400 text-xs sm:text-sm font-semibold mb-1">
                Expected Output
              </label>
              <textarea
                value={test.output}
                onChange={(e) =>
                  handleTestChange(
                    "hiddenTestCases",
                    index,
                    "output",
                    e.target.value
                  )
                }
                rows="2"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2 text-sm"
              ></textarea>

              {formData.hiddenTestCases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestCase("hiddenTestCases", index)}
                  className="text-red-400 hover:text-red-600 text-xs sm:text-sm"
                >
                  ❌ Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addTestCase("hiddenTestCases")}
            className="text-purple-400 hover:text-purple-600 text-xs sm:text-sm"
          >
            ➕ Add Hidden Test Case
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#f89f1b] hover:bg-[#e98c00] text-black font-semibold py-2 sm:py-3 rounded text-sm sm:text-base"
        >
          💾 Update Problem
        </button>
      </form>
    </div>
  );
};

export default EditProblem;
