const problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const {
  getLanguageId,
  submitBatch,
  submitToken,
} = require("../utilis/Problemutility");

// const createproblem=async(req,res)=>{
// 	console.log("Request body =>", req.body);

// 	// const {title,description,difficulty,tags,visibletestcases,hiddentestcases,startcode=[],referencesolution=[],problemcreator}=req.body;
// 	const {
//   title,
//   description,
//   difficulty,
//   tags,
//   visibleTestCases = [],
//   hiddenTestCases = [],
//   startcode = [],
//   referencesolution = [],
//   problemcreator
// } = req.body;

// 	try{
// 		const refs = Array.isArray(referencesolution) ? referencesolution : [];
// 		   if (!Array.isArray(referencesolution)) {
//       return res.status(400).json({ message: "referencesolution must be an array" });
//     }

// 		for(const {language,completeCode} of refs){

//     // source code
// 		// language_id
// 		// stdin
// 		// expected_output
// 		const language_id=getLanguageId(language);

// 		// i am creating batch submission
//     const submissions=visibleTestCases.map((testcase)=>({
// 			source_code:completeCode,
// 			language_id:language_id,
// 			stdin:testcase.input,
// 			expected_output:testcase.output

// 		}));
// 		const submitresult=await submitBatch(submissions);
// 		// console.log(submitresult);

// 		const resulttoken=submitresult.map((value)=>value.token);
// 		// console.log(resulttoken);
// 		    const testresult=    await submitToken(resulttoken);
// 				// console.log(testresult);
// 				for(const test of testresult){
// 					if(test.status_id!==3){
// 						res.status(400).json({
// 							message:"reference solution is not passing all the test cases"
// 						})
// 					}
// 					else if(test.status_id==5){
// 						res.status(400).json({
// 							message:"time limit exceded"
// 						})

// 					}

// 				}

// 		}
// 		// we can store the problem in the database
// 	const userproblem=	await problem.create({
// 			...req.body,
// 			problemcreator:req.result._id
// 		})
// 		res.status(201).json({
// 			message:"problem created successfully",
// 		})

// 	}
// 	catch(err){
//    console.log(err);
// 	 res.status(400).json({
// 		message:err.message
// 	 })

// 	}
// }
// const createproblem = async (req, res) => {
// 	 console.log("STARTCODE:", req.body.startcode, Array.isArray(req.body.startcode));
//     console.log("REFERENCESOLUTION:", req.body.referencesolution, Array.isArray(req.body.referencesolution));

//   try {
//     const {
//       title, description, difficulty, tags,
//       visibleTestCases = [], hiddenTestCases = [],
//       startcode = [], referencesolution = [], problemcreator
//     } = req.body;

//     if (!Array.isArray(referencesolution)) {
//       return res.status(400).json({ message: "referencesolution must be an array" });
//     }

//     for (const { language, initialcode } of referencesolution) {
//       const language_id = getLanguageId(language);

//       const submissions = visibleTestCases.map(testcase => ({
//         source_code: initialcode,
//         language_id:language_id,
//         stdin: testcase.input,
//         expected_output: testcase.output
//       }));

//       const submitResult = await submitBatch(submissions);
//       const tokens = submitResult.map(v => v.token);
//       const testResults = await submitToken(tokens);

//       for (const test of testResults) {
//         const statusId = test.status.id;
//         if (statusId !== 3) { // 3 = Accepted
//           if (statusId === 4) return res.status(400).json({ message: "Wrong Answer" });
//           if (statusId === 5) return res.status(400).json({ message: "Time Limit Exceeded" });
//           if (statusId === 6) return res.status(400).json({ message: "Compilation Error" });
//           if (statusId === 9) return res.status(400).json({ message: "Runtime Error" });
//         }
//       }
//     }

//     const userProblem = await problem.create({
//       ...req.body,
//       problemcreator: req.result._id
//     });

//     return res.status(201).json({ message: "Problem created successfully", problem: userProblem });

//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: err.message });
//   }
// };

const createproblem = async (req, res) => {
  // console.log("Frontend sent this data:", req.body);
  // console.log(
  //   "STARTCODE:",
  //   req.body.startcode,
  //   Array.isArray(req.body.startcode)
  // );
  // console.log(
  //   "REFERENCESOLUTION:",
  //   req.body.referencesolution,
  //   Array.isArray(req.body.referencesolution)
  // );

  try {
    const userProblem = await problem.create({
      ...req.body,
      problemcreator: req.result._id,
    });

    return res.status(201).json({
      message: "Problem created successfully",
      problem: userProblem,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const updateproblem = async (req, res) => {
  const { id } = req.params;
  // console.log("request body", req.body);
  //  const {title,description,difficulty,tags,visibletestcases,hiddentestcases,startcode,referencesolution}=req.body;
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases = [],
    hiddenTestCases = [],
    startcode = [],
    referencesolution = [],
    problemcreator,
  } = req.body;

  try {
    if (!id) {
      return res.status(400).send("missing id filed");
    }
    const dsaproblem = await problem.findById(id);
    if (!dsaproblem) {
      return res.status(404).send("problem not found");
    }
    // const refs = Array.isArray(referencesolution) ? referencesolution : [];
    // for (const { language, initialcode } of refs) {
    //   // source code
    //   // language_id
    //   // stdin
    //   // expected_output
    //   const language_id = getLanguageId(language);

    //   // i am creating batch submission
    //   const submissions = visibleTestCases.map((testcase) => ({
    //     source_code: initialcode,
    //     language_id: language_id,
    //     stdin: testcase.input,
    //     expected_output: testcase.output,
    //   }));
    //   const submitresult = await submitBatch(submissions);
    //   // console.log(submitresult);

    //   const resulttoken = submitresult.map((value) => value.token);
    //   // console.log(resulttoken);
    //   const testresult = await submitToken(resulttoken);
    //   // console.log(testresult);
    //   for (const test of testresult) {
    //     if (test.status_id !== 3) {
    //       res.status(400).json({
    //         message: "reference solution is not passing all the test cases",
    //       });
    //     } else if (test.status_id == 5) {
    //       res.status(400).json({
    //         message: "time limit exceded",
    //       });
    //     } else if (test.status_id == 6) {
    //       res.status(400).json({
    //         message: "compilation error",
    //       });
    //     } else if (test.status_id == 9) {
    //       res.status(400).json({
    //         message: "Runtime error",
    //       });
    //     } else if (test.status_id == 3) {
    //       res.status(400).json({
    //         message: "Accepted",
    //       });
    //     } else if (test.status_id == 4) {
    //       res.status(400).json({
    //         message: "wrong answer",
    //       });
    //     }
    //   }
    // }
    const newproblem = await problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true }
    );
    // new means naya wala update document dena
    res.status(200).send(newproblem);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
};
const deleteproblem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).send("id id missing");
    }
    const deleteproblem = await problem.findByIdAndDelete(id);
    if (!deleteproblem) {
      return res.status(404).send("problem not found");
    }
    return res.status(200).send("successfully deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getproblembyid = async (req, res) => {
  // console.log("frotend req is comming", req.params);
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).send("id is missing");
    }
    // const getproblem=await problem.findById(id).select(' _id title description difficulty tags visibleTestCases startcode hiddenTestCases problemcreator referencesolution');
    const getproblem = await problem
      .findById(id)
      .select(
        "_id title description difficulty tags visibleTestCases hiddenTestCases startcode referencesolution problemcreator drivercode"
      );

    /// select ke ander jo bhi rahega whi frontend ko jaiyega
    if (!getproblem) {
      return res.status(404).send("problem is missing");
    }
    // console.log("req from frontend to edit page:", getproblem);
    return res.status(200).json(getproblem);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
const getallproblem = async (req, res) => {
  try {
    const getproblem = await problem
      .find({})
      .select("_id title difficulty tags");
    if (getproblem.length == 0) {
      return res.status(404).send("problem is missing");
    }
    return res.status(200).json(getproblem);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const solvedproblembyuser = async (req, res) => {
  try {
    const count = req.result.problemsolved.length;
    const userId = req.result._id;
    const user = await User.findById(userId).populate(
      "problemsolved",
      "_id title difficulty tags"
    );
    // ye populate isliye kiya taki probmlemsolved ke ander jo id hai uske corressponding title difficulty tags bhi mil jaye
    //  problemsolved hai problem id store kiya hai  user model ke ander

    res.status(200).json({
      count: count,
      user,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
// const submittedproblem=async(req,res)=>{
// 	try{
// 		const userId=req.result._id;
// 		const problemId=req.params.id;
// 		const ans=await Submission.find({userId,problemId});
// 		if(ans.length==0){
// 			res.status(200).send("no submission");
// 		}
// 		res.status(200).send(ans);

// 	}
// 	catch(err){
// 		res.status(500).send("internal server error");

// 	}
// }
const submittedproblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body; // code user submitted

    // Fetch problem
    const problemData = await problem.findById(problemId);
    if (!problemData)
      return res.status(404).json({ message: "Problem not found" });

    const testCases = [
      ...problemData.visibleTestCases,
      ...problemData.hiddenTestCases,
    ];

    const submissions = testCases.map((tc) => ({
      source_code: code,
      language_id: getLanguageId(language),
      stdin: tc.input,
      expected_output: tc.output,
    }));

    const submitResult = await submitBatch(submissions);
    const tokens = submitResult.map((v) => v.token);
    const results = await submitToken(tokens);

    // Save submission
    const submissionRecord = await Submission.create({
      userId,
      problemId,
      code,
      language,
      results,
    });

    return res.status(200).json({
      message: "Submission evaluated",
      submission: submissionRecord,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createproblem,
  updateproblem,
  deleteproblem,
  getproblembyid,
  getallproblem,
  solvedproblembyuser,
  submittedproblem,
};
