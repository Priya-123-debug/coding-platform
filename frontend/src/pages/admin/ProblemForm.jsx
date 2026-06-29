// // pages/admin/ProblemForm.jsx
// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import axiosClient from "../../utilis/axiosClient";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

// const ProblemForm = () => {
//   const navigate = useNavigate();
//   // const token = useSelector((state) => state.auth.user?.token);
// 	//   const [token, setToken] = useState(null);

//   // useEffect(() => {
//   //   const storedToken = localStorage.getItem("token");
//   //   if (storedToken) setToken(storedToken);
//   // }, []);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     difficulty: "easy",
//     tags: [],
//     visibleTestCases: [{ input: "", output: "", explanation: "" }],
//     hiddenTestCases: [
//       {
//         input: "",
//         output: "",
//         startcode: [{ language: "cpp", initialcode: "" }],
//         referencesolution: [{ language: "cpp", initialcode: "" }],
//       },
//     ],
//   });

//   // Basic input changes
//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   // Tags
//   const handleTagChange = (tag) => {
//     if (!formData.tags.includes(tag))
//       setFormData({ ...formData, tags: [...formData.tags, tag] });
//   };

//   const removeTag = (tag) => {
//     setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
//   };

//   // Visible test cases
//   const addVisibleTestCase = () => {
//     setFormData({
//       ...formData,
//       visibleTestCases: [
//         ...formData.visibleTestCases,
//         { input: "", output: "", explanation: "" },
//       ],
//     });
//   };

//   const updateVisibleTestCase = (index, key, value) => {
//     const newCases = [...formData.visibleTestCases];
//     newCases[index][key] = value;
//     setFormData({ ...formData, visibleTestCases: newCases });
//   };

//   // Hidden test cases
//   const addHiddenTestCase = () => {
//     setFormData({
//       ...formData,
//       hiddenTestCases: [
//         ...formData.hiddenTestCases,
//         {
//           input: "",
//           output: "",
//           startcode: [{ language: "cpp", initialcode: "" }],
//           referencesolution: [{ language: "cpp", initialcode: "" }],
//         },
//       ],
//     });
//   };

//   const updateHiddenTestCase = (index, key, value) => {
//     const newCases = [...formData.hiddenTestCases];
//     newCases[index][key] = value;
//     setFormData({ ...formData, hiddenTestCases: newCases });
//   };

//   // Startcode & ReferenceSolution inside hidden test cases
//   const updateNestedCode = (hiddenIndex, type, codeIndex, field, value) => {
//     const newCases = [...formData.hiddenTestCases];
//     newCases[hiddenIndex][type][codeIndex][field] = value;
//     setFormData({ ...formData, hiddenTestCases: newCases });
//   };

//   const addNestedCode = (hiddenIndex, type) => {
//     const newCases = [...formData.hiddenTestCases];
//     newCases[hiddenIndex][type].push({ language: "cpp", initialcode: "" });
//     setFormData({ ...formData, hiddenTestCases: newCases });
//   };

//   // Submit

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     await axiosClient.post("/problem/create", formData, {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     });
//   //     alert("Problem created successfully!");
//   //     navigate("/admin");
//   //   } catch (err) {
//   //     console.log("Error saving problem:", err);
//   //     alert(err.response?.data?.message || "Error saving problem");
//   //   }
//   // };
// 	const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     // No need to send Authorization header
//     await axiosClient.post("/problem/create", formData);
//     alert("Problem created successfully!");
//     navigate("/admin");
//   } catch (err) {
//     console.error("Error saving problem:", err.response?.data || err);
//     alert(err.response?.data?.message || "Error saving problem");
//   }
// };

//   return (
//     <div className="p-6 bg-gray-900 text-white rounded-lg max-w-5xl mx-auto">
//       <h2 className="text-2xl mb-4">Create Problem</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Title */}
//         <input
//           name="title"
//           placeholder="Problem Title"
//           value={formData.title}
//           onChange={handleChange}
//           className="w-full mb-4 p-2 rounded bg-gray-800"
//           required
//         />

//         {/* Description */}
//         <textarea
//           name="description"
//           placeholder="Problem Description"
//           value={formData.description}
//           onChange={handleChange}
//           className="w-full mb-4 p-2 rounded bg-gray-800"
//           rows={6}
//           required
//         />

//         {/* Difficulty */}
//         <select
//           name="difficulty"
//           value={formData.difficulty}
//           onChange={handleChange}
//           className="w-full mb-4 p-2 rounded bg-gray-800"
//         >
//           <option value="easy">Easy</option>
//           <option value="medium">Medium</option>
//           <option value="hard">Hard</option>
//         </select>

//         {/* Tags */}
//         <div className="mb-4 flex flex-wrap gap-2">
//           {["array", "string", "dp", "tree", "graph", "math", "greedy", "backtracking"].map(
//             (tag) => (
//               <button
//                 type="button"
//                 key={tag}
//                 onClick={() => handleTagChange(tag)}
//                 className={`px-2 py-1 rounded ${
//                   formData.tags.includes(tag) ? "bg-blue-500" : "bg-gray-600"
//                 }`}
//               >
//                 {tag}
//               </button>
//             )
//           )}
//         </div>

//         {/* Visible Test Cases */}
//         <h3 className="text-xl mb-2">Visible Test Cases</h3>
//         {formData.visibleTestCases.map((tc, i) => (
//           <div key={i} className="mb-4 p-2 bg-gray-800 rounded">
//             <input
//               placeholder="Input"
//               value={tc.input}
//               onChange={(e) => updateVisibleTestCase(i, "input", e.target.value)}
//               className="w-full mb-1 p-1 rounded bg-gray-700"
//               required
//             />
//             <input
//               placeholder="Output"
//               value={tc.output}
//               onChange={(e) => updateVisibleTestCase(i, "output", e.target.value)}
//               className="w-full mb-1 p-1 rounded bg-gray-700"
//               required
//             />
//             <input
//               placeholder="Explanation"
//               value={tc.explanation}
//               onChange={(e) => updateVisibleTestCase(i, "explanation", e.target.value)}
//               className="w-full mb-1 p-1 rounded bg-gray-700"
//             />
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={addVisibleTestCase}
//           className="mb-4 px-4 py-2 bg-green-500 rounded"
//         >
//           Add Visible Test Case
//         </button>

//         {/* Hidden Test Cases */}
//         <h3 className="text-xl mb-2">Hidden Test Cases</h3>
//         {formData.hiddenTestCases.map((tc, i) => (
//           <div key={i} className="mb-4 p-2 bg-gray-800 rounded">
//             <input
//               placeholder="Input"
//               value={tc.input}
//               onChange={(e) => updateHiddenTestCase(i, "input", e.target.value)}
//               className="w-full mb-1 p-1 rounded bg-gray-700"
//               required
//             />
//             <input
//               placeholder="Output"
//               value={tc.output}
//               onChange={(e) => updateHiddenTestCase(i, "output", e.target.value)}
//               className="w-full mb-2 p-1 rounded bg-gray-700"
//               required
//             />

//             {/* Startcode */}
//             <h4 className="text-lg mb-1">Start Code</h4>
//             {tc.startcode.map((sc, j) => (
//               <div key={j} className="mb-1">
//                 <input
//                   placeholder="Language"
//                   value={sc.language}
//                   onChange={(e) => updateNestedCode(i, "startcode", j, "language", e.target.value)}
//                   className="mr-2 mb-1 p-1 rounded bg-gray-700"
//                   required
//                 />
//                 <textarea
//                   placeholder="Initial Code"
//                   value={sc.initialcode}
//                   onChange={(e) => updateNestedCode(i, "startcode", j, "initialcode", e.target.value)}
//                   className="w-full mb-1 p-1 rounded bg-gray-700"
//                   rows={3}
//                   required
//                 />
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => addNestedCode(i, "startcode")}
//               className="mb-2 px-3 py-1 bg-green-500 rounded"
//             >
//               Add Start Code
//             </button>

//             {/* Reference Solution */}
//             <h4 className="text-lg mb-1">Reference Solution</h4>
//             {tc.referencesolution.map((rs, j) => (
//               <div key={j} className="mb-1">
//                 <input
//                   placeholder="Language"
//                   value={rs.language}
//                   onChange={(e) => updateNestedCode(i, "referencesolution", j, "language", e.target.value)}
//                   className="mr-2 mb-1 p-1 rounded bg-gray-700"
//                   required
//                 />
//                 <textarea
//                   placeholder="Reference Code"
//                   value={rs.initialcode}
//                   onChange={(e) => updateNestedCode(i, "referencesolution", j, "initialcode", e.target.value)}
//                   className="w-full mb-1 p-1 rounded bg-gray-700"
//                   rows={3}
//                   required
//                 />
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => addNestedCode(i, "referencesolution")}
//               className="mb-2 px-3 py-1 bg-green-500 rounded"
//             >
//               Add Reference Solution
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={addHiddenTestCase}
//           className="mb-4 px-4 py-2 bg-green-500 rounded"
//         >
//           Add Hidden Test Case
//         </button>

//         <button type="submit" className="px-6 py-2 bg-blue-500 rounded">
//           Save Problem
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ProblemForm;

// pages/admin/ProblemForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../utilis/axiosClient";

const ProblemForm = () => {
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const availableLanguages = [
    { value: "cpp", label: "C++" },
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
    { value: "c", label: "C" },
  ];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    tags: [],
    visibleTestCases: [{ displayInput: "", input: "", output: "", explanation: "" }],
    hiddenTestCases: [{ displayInput: "", input: "", output: "" }],
    startcode: [{ language: "cpp", initialcode: "" }],
    drivercode: [{ language: "cpp", importcode: "", maincode: "" }],
    referencesolution: [{ language: "cpp", initialcode: "" }],
  });

  // Basic input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Tags
  const handleTagChange = (tag) => {
    if (!formData.tags.includes(tag))
      setFormData({ ...formData, tags: [...formData.tags, tag] });
  };
  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  // Visible test cases
  const addVisibleTestCase = () =>
    setFormData({
      ...formData,
      visibleTestCases: [
        ...formData.visibleTestCases,
        { displayInput: "", input: "", output: "", explanation: "" },
      ],
    });
  const updateVisibleTestCase = (index, key, value) => {
    const newCases = [...formData.visibleTestCases];
    newCases[index][key] = value;
    setFormData({ ...formData, visibleTestCases: newCases });
  };
  const removeVisibleTestCase = (index) => {
    const newCases = formData.visibleTestCases.filter((_, i) => i !== index);
    setFormData({ ...formData, visibleTestCases: newCases });
  };

  // Hidden test cases
  const addHiddenTestCase = () =>
    setFormData({
      ...formData,
      hiddenTestCases: [...formData.hiddenTestCases, { displayInput: "", input: "", output: "" }],
    });
  const updateHiddenTestCase = (index, key, value) => {
    const newCases = [...formData.hiddenTestCases];
    newCases[index][key] = value;
    setFormData({ ...formData, hiddenTestCases: newCases });
  };
  const removeHiddenTestCase = (index) => {
    const newCases = formData.hiddenTestCases.filter((_, i) => i !== index);
    setFormData({ ...formData, hiddenTestCases: newCases });
  };

  // Startcode & Reference Solution
  const updateCode = (type, index, key, value) => {
    const newArr = [...formData[type]];
    newArr[index][key] = value;
    setFormData({ ...formData, [type]: newArr });
  };
  const addCode = (type) => {
    setFormData({
      ...formData,
      [type]: [
        ...formData[type],
        type === "drivercode"
          ? { language: "", importcode: "", maincode: "" }
          : { language: "", initialcode: "" },
      ],
    });
  };
  const removeCode = (type, index) => {
    const newArr = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: newArr });
  };

  // Handle language tab change
  const handleLanguageTabChange = (language) => {
    setSelectedLanguage(language);
    
    // Get current code for selected language or create empty entry
    const getCodeForLanguage = (type) => {
      const existingCode = formData[type].find((code) => code.language === language);
      if (existingCode) return existingCode;
      
      return type === "drivercode"
        ? { language, importcode: "", maincode: "" }
        : { language, initialcode: "" };
    };

    const startCode = getCodeForLanguage("startcode");
    const driverCode = getCodeForLanguage("drivercode");
    const refSolution = getCodeForLanguage("referencesolution");

    // Update formData to show code for selected language
    const updatedStartCode = [...formData.startcode.filter(c => c.language !== language), startCode];
    const updatedDriverCode = [...formData.drivercode.filter(c => c.language !== language), driverCode];
    const updatedRefSolution = [...formData.referencesolution.filter(c => c.language !== language), refSolution];

    setFormData({
      ...formData,
      startcode: updatedStartCode,
      drivercode: updatedDriverCode,
      referencesolution: updatedRefSolution,
    });
  };

  // Get code for current selected language
  const getCurrentLanguageCode = (type) => {
    return formData[type].find((code) => code.language === selectedLanguage) || 
      (type === "drivercode" 
        ? { language: selectedLanguage, importcode: "", maincode: "" }
        : { language: selectedLanguage, initialcode: "" });
  };

  // Update code for current selected language
  const updateCurrentLanguageCode = (type, field, value) => {
    const newArr = [...formData[type]];
    const index = newArr.findIndex((code) => code.language === selectedLanguage);
    
    if (index !== -1) {
      newArr[index][field] = value;
    } else {
      const newEntry = type === "drivercode"
        ? { language: selectedLanguage, importcode: "", maincode: "" }
        : { language: selectedLanguage, initialcode: "" };
      newEntry[field] = value;
      newArr.push(newEntry);
    }
    
    setFormData({ ...formData, [type]: newArr });
  };

  // Submit
  const handleSubmit = async (e) => {
    // console.log("Data being sent to backend:", formData);
    e.preventDefault();
    try {
      await axiosClient.post("/problem/create", formData);
      alert("Problem created successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("Error saving problem:", err.response?.data || err);
      alert(err.response?.data?.message || "Error saving problem");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg max-w-5xl mx-auto">
      <h2 className="text-2xl mb-4">Create Problem</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <input
          name="title"
          placeholder="Problem Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-800"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Problem Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-800"
          rows={6}
          required
        />

        {/* Difficulty */}
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-800"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            "array",
            "string",
            "dp",
            "tree",
            "graph",
            "math",
            "greedy",
            "backtracking",
          ].map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => handleTagChange(tag)}
              className={`px-2 py-1 rounded ${
                formData.tags.includes(tag) ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Visible Test Cases */}
        <h3 className="text-xl mb-2">Visible Test Cases</h3>
        {formData.visibleTestCases.map((tc, i) => (
          <div key={i} className="mb-4 p-2 bg-gray-800 rounded">
            <label className="block text-gray-400 text-sm mb-1">Display Input (User-friendly format)</label>
            <input
              placeholder="e.g., nums = [2, 7, 11, 15], target = 9"
              value={tc.displayInput}
              onChange={(e) =>
                updateVisibleTestCase(i, "displayInput", e.target.value)
              }
              className="w-full mb-2 p-1 rounded bg-gray-700"
              required
            />
            <label className="block text-gray-400 text-sm mb-1">Actual Input (Backend format)</label>
            <input
              placeholder="e.g., 4 2 7 11 15 9"
              value={tc.input}
              onChange={(e) =>
                updateVisibleTestCase(i, "input", e.target.value)
              }
              className="w-full mb-2 p-1 rounded bg-gray-700"
              required
            />
            <label className="block text-gray-400 text-sm mb-1">Output</label>
            <input
              placeholder="Output"
              value={tc.output}
              onChange={(e) =>
                updateVisibleTestCase(i, "output", e.target.value)
              }
              className="w-full mb-2 p-1 rounded bg-gray-700"
              required
            />
            <label className="block text-gray-400 text-sm mb-1">Explanation</label>
            <input
              placeholder="Explanation"
              value={tc.explanation}
              onChange={(e) =>
                updateVisibleTestCase(i, "explanation", e.target.value)
              }
              className="w-full mb-1 p-1 rounded bg-gray-700"
            />
            {formData.visibleTestCases.length > 1 && (
              <button
                type="button"
                onClick={() => removeVisibleTestCase(i)}
                className="mt-1 text-red-400 hover:text-red-600 text-sm"
              >
                ❌ Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addVisibleTestCase}
          className="mb-4 px-4 py-2 bg-green-500 rounded"
        >
          Add Visible Test Case
        </button>

        {/* Hidden Test Cases */}
        <h3 className="text-xl mb-2">Hidden Test Cases</h3>
        {formData.hiddenTestCases.map((tc, i) => (
          <div key={i} className="mb-4 p-2 bg-gray-800 rounded">
            <label className="block text-gray-400 text-sm mb-1">Display Input (User-friendly format)</label>
            <input
              placeholder="e.g., nums = [2, 7, 11, 15], target = 9"
              value={tc.displayInput}
              onChange={(e) =>
                updateHiddenTestCase(i, "displayInput", e.target.value)
              }
              className="w-full mb-2 p-1 rounded bg-gray-700"
              required
            />
            <label className="block text-gray-400 text-sm mb-1">Actual Input (Backend format)</label>
            <input
              placeholder="e.g., 4 2 7 11 15 9"
              value={tc.input}
              onChange={(e) => updateHiddenTestCase(i, "input", e.target.value)}
              className="w-full mb-2 p-1 rounded bg-gray-700"
              required
            />
            <label className="block text-gray-400 text-sm mb-1">Output</label>
            <input
              placeholder="Output"
              value={tc.output}
              onChange={(e) =>
                updateHiddenTestCase(i, "output", e.target.value)
              }
              className="w-full mb-2 p-1 rounded bg-gray-700"
              required
            />
            {formData.hiddenTestCases.length > 1 && (
              <button
                type="button"
                onClick={() => removeHiddenTestCase(i)}
                className="mt-1 text-red-400 hover:text-red-600 text-sm"
              >
                ❌ Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addHiddenTestCase}
          className="mb-4 px-4 py-2 bg-green-500 rounded"
        >
          Add Hidden Test Case
        </button>

        {/* Language Tabs for Code Sections */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-3">
            💻 Code Sections (by Language)
          </h3>
          
          {/* Language Tabs */}
          <div className="flex gap-2 mb-4 border-b border-gray-700 overflow-x-auto pb-2">
            {availableLanguages.map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => handleLanguageTabChange(lang.value)}
                className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
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
            <h4 className="text-lg font-semibold text-green-400 mb-2">
              Starter Code
            </h4>
            <div className="border border-gray-700 p-3 rounded bg-gray-800">
              <textarea
                value={getCurrentLanguageCode("startcode").initialcode}
                onChange={(e) =>
                  updateCurrentLanguageCode("startcode", "initialcode", e.target.value)
                }
                rows="8"
                className="w-full p-2 rounded bg-gray-700 text-white font-mono"
                placeholder={`Enter starter code for ${availableLanguages.find(l => l.value === selectedLanguage)?.label}...`}
              ></textarea>
            </div>
          </div>

          {/* Driver Code for selected language */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-indigo-400 mb-2">
              Driver Code (Hidden)
            </h4>
            <div className="border border-gray-700 p-3 rounded bg-gray-800">
              <label className="block text-gray-400 text-sm mb-1">
                Top code (imports, using directives, etc.)
              </label>
              <textarea
                value={getCurrentLanguageCode("drivercode").importcode || ""}
                onChange={(e) =>
                  updateCurrentLanguageCode("drivercode", "importcode", e.target.value)
                }
                rows="4"
                className="w-full p-2 rounded bg-gray-700 text-white mb-3 font-mono"
                placeholder="Enter imports and class definition..."
              ></textarea>

              <label className="block text-gray-400 text-sm mb-1">
                Bottom code (int main / runner that uses Solution)
              </label>
              <textarea
                value={getCurrentLanguageCode("drivercode").maincode || ""}
                onChange={(e) =>
                  updateCurrentLanguageCode("drivercode", "maincode", e.target.value)
                }
                rows="6"
                className="w-full p-2 rounded bg-gray-700 text-white font-mono"
                placeholder="Enter main function or runner code..."
              ></textarea>
            </div>
          </div>

          {/* Reference Solution for selected language */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-yellow-400 mb-2">
              Reference Solution
            </h4>
            <div className="border border-gray-700 p-3 rounded bg-gray-800">
              <textarea
                value={getCurrentLanguageCode("referencesolution").initialcode}
                onChange={(e) =>
                  updateCurrentLanguageCode("referencesolution", "initialcode", e.target.value)
                }
                rows="8"
                className="w-full p-2 rounded bg-gray-700 text-white font-mono"
                placeholder={`Enter reference solution for ${availableLanguages.find(l => l.value === selectedLanguage)?.label}...`}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Old code sections - hidden */}
        <div style={{ display: "none" }}>
        {/* Driver Code (hidden main/runner) */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Driver Code (hidden)</h3>
          {formData.drivercode.map((code, index) => (
            <div key={index} className="mb-4 p-2 bg-gray-800 rounded">
              <label className="block text-gray-400 text-sm mb-1">
                Language
              </label>
              <select
                value={code.language}
                onChange={(e) =>
                  updateCode("drivercode", index, "language", e.target.value)
                }
                className="w-full mb-2 p-2 rounded bg-gray-700"
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
                placeholder="Top code (imports, using directives, etc.)"
                value={code.importcode || ""}
                onChange={(e) =>
                  updateCode("drivercode", index, "importcode", e.target.value)
                }
                className="w-full mb-1 p-1 rounded bg-gray-700 font-mono"
                rows={3}
              />
              <label className="block text-gray-400 text-sm mb-1">
                Bottom code (int main / runner that uses Solution)
              </label>
              <textarea
                placeholder="Bottom code (int main / runner that uses Solution)"
                value={code.maincode || ""}
                onChange={(e) =>
                  updateCode("drivercode", index, "maincode", e.target.value)
                }
                className="w-full mb-1 p-1 rounded bg-gray-700 font-mono"
                rows={4}
              />
              {formData.drivercode.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCode("drivercode", index)}
                  className="text-red-400 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addCode("drivercode")}
            className="mb-4 px-4 py-2 bg-green-500 rounded"
          >
            Add Driver Code
          </button>
        </div>

        {/* Startcode */}
        <h3 className="text-xl mb-2">Start Code</h3>
        {formData.startcode.map((sc, i) => (
          <div key={i} className="mb-2 p-2 bg-gray-800 rounded">
            <label className="block text-gray-400 text-sm mb-1">
              Language
            </label>
            <select
              value={sc.language}
              onChange={(e) =>
                updateCode("startcode", i, "language", e.target.value)
              }
              className="w-full mb-2 p-2 rounded bg-gray-700"
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
              placeholder="Initial Code"
              value={sc.initialcode}
              onChange={(e) =>
                updateCode("startcode", i, "initialcode", e.target.value)
              }
              className="w-full mb-1 p-1 rounded bg-gray-700 font-mono"
              rows={5}
              required
            />
            {formData.startcode.length > 1 && (
              <button
                type="button"
                onClick={() => removeCode("startcode", i)}
                className="mt-1 text-red-400 hover:text-red-600 text-sm"
              >
                ❌ Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addCode("startcode")}
          className="mb-4 px-3 py-1 bg-green-500 rounded"
        >
          Add Start Code
        </button>

        {/* Reference Solution */}
        <h3 className="text-xl mb-2">Reference Solution</h3>
        {formData.referencesolution.map((rs, i) => (
          <div key={i} className="mb-2 p-2 bg-gray-800 rounded">
            <label className="block text-gray-400 text-sm mb-1">
              Language
            </label>
            <select
              value={rs.language}
              onChange={(e) =>
                updateCode("referencesolution", i, "language", e.target.value)
              }
              className="w-full mb-2 p-2 rounded bg-gray-700"
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
              placeholder="Reference Code"
              value={rs.initialcode}
              onChange={(e) =>
                updateCode(
                  "referencesolution",
                  i,
                  "initialcode",
                  e.target.value
                )
              }
              className="w-full mb-1 p-1 rounded bg-gray-700 font-mono"
              rows={5}
              required
            />
            {formData.referencesolution.length > 1 && (
              <button
                type="button"
                onClick={() => removeCode("referencesolution", i)}
                className="mt-1 text-red-400 hover:text-red-600 text-sm"
              >
                ❌ Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addCode("referencesolution")}
          className="mb-4 px-3 py-1 bg-green-500 rounded"
        >
          Add Reference Solution
        </button>
        </div>

        <button type="submit" className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors">
          Save Problem
        </button>
      </form>
    </div>
  );
};

export default ProblemForm;
