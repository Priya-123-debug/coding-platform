import { useEffect, useState } from "react";

function CodeTyping() {
  const code = `function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
}`;

  const [displayedCode, setDisplayedCode] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode((prev) => prev + code[index]);
        setIndex((prev) => prev + 1);
      }, 30); // typing speed

      return () => clearTimeout(timeout);
    }
  }, [index, code]);

  return (
    <pre className="text-green-400 font-mono text-sm leading-relaxed">
      {displayedCode}
      <span className="animate-pulse">|</span>
    </pre>
  );
}

export default CodeTyping;
