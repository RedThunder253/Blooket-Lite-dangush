export const DEFAULT_QUESTIONS = [
  // React Basics
  {
    id: 1,
    text: "What does JSX let you do in React?",
    options: ["Write HTML inside JavaScript", "Write CSS inside HTML", "Write SQL inside JavaScript", "Write Python inside JavaScript"],
    correctIndex: 0,
  },
  {
    id: 2,
    text: "What is a React component?",
    options: ["A function or class that returns UI", "A database table", "A browser extension", "A CSS file"],
    correctIndex: 0,
  },
  {
    id: 3,
    text: "What must a React component return?",
    options: ["An image", "JSX", "A string", "A CSS class"],
    correctIndex: 1,
  },
  {
    id: 4,
    text: "What is the correct way to insert a variable into JSX?",
    options: ["{{variable}}", "<variable>", "{variable}", "$variable"],
    correctIndex: 2,
  },
  {
    id: 5,
    text: "What does props in React mean?",
    options: ["CSS rules", "Inputs passed into a component", "Special React files", "Hidden commands"],
    correctIndex: 1,
  },
  {
    id: 6,
    text: "Which hook lets you add state to a function component?",
    options: ["useState", "useEffect", "useHook", "useVariable"],
    correctIndex: 0,
  },
  {
    id: 7,
    text: "Which of these is a correct React component name?",
    options: ["mybutton", "MyButton", "my_button", "button123"],
    correctIndex: 1,
  },
  
  // Next.js (Page Router, Link, Image)
  {
    id: 8,
    text: "Where do you put your pages in a Next.js project (Page Router)?",
    options: ["/styles folder", "/pages folder", "/components folder", "/public folder"],
    correctIndex: 1,
  },
  {
    id: 9,
    text: "How do you link between pages in Next.js?",
    options: ["<a href=\"/about\">About</a>", "<Link href=\"/about\">About</Link>", "<goto page=\"about\" />", "<Route path=\"/about\" />"],
    correctIndex: 1,
  },
  {
    id: 10,
    text: "Why use next/image instead of <img>?",
    options: ["It looks cooler", "It automatically optimizes images", "It only works with GIFs", "It adds animations"],
    correctIndex: 1,
  },
  {
    id: 11,
    text: "What happens if you create pages/about.js in Next.js?",
    options: ["You get an /about route", "The app crashes", "It creates a database", "Nothing"],
    correctIndex: 0,
  },
  {
    id: 12,
    text: "What is the default file served at / in Next.js?",
    options: ["pages/home.js", "pages/index.js", "pages/root.js", "pages/start.js"],
    correctIndex: 1,
  },
  {
    id: 13,
    text: "What folder should you put static images in for Next.js?",
    options: ["/images", "/components", "/public", "/assets"],
    correctIndex: 2,
  },
  {
    id: 14,
    text: "Which of these is the correct Next.js <Link> usage?",
    options: ["<Link href=\"/about\">Go</Link>", "<Link to=\"/about\">Go</Link>", "<a href=\"/about\">Go</a>", "<Goto href=\"/about\" />"],
    correctIndex: 0,
  },
  
  // Tailwind CSS
  {
    id: 15,
    text: "What is Tailwind CSS?",
    options: ["A new programming language", "A CSS framework with utility classes", "A JavaScript library", "A web browser"],
    correctIndex: 1,
  },
  {
    id: 16,
    text: "What does bg-blue-500 do in Tailwind?",
    options: ["Sets a light blue background", "Adds blue text", "Creates a blue border", "Resizes text"],
    correctIndex: 0,
  },
  {
    id: 17,
    text: "What class would make text red in Tailwind?",
    options: ["color-red", "text-red-500", "font-red", "bg-red"],
    correctIndex: 1,
  },
  {
    id: 18,
    text: "Which Tailwind class adds margin of 4 units?",
    options: ["m-4", "margin-4", "padding-4", "mg-4"],
    correctIndex: 0,
  },
  
  // Terminal Usage
  {
    id: 19,
    text: "Which command lists files in a folder (Mac/Linux)?",
    options: ["ls", "cd", "rm", "open"],
    correctIndex: 0,
  },
  {
    id: 20,
    text: "What does cd do in the terminal?",
    options: ["Creates a new file", "Changes the current directory", "Deletes a folder", "Copies data"],
    correctIndex: 1,
  },
  {
    id: 21,
    text: "How do you go back one folder in the terminal?",
    options: ["cd ..", "cd /", "cd back", "ls .."],
    correctIndex: 0,
  },
  {
    id: 22,
    text: "What does npm run dev usually do in a Next.js project?",
    options: ["Starts the development server", "Deletes the app", "Installs packages", "Builds the final website"],
    correctIndex: 0,
  },
  
  // Arrow Functions & map
  {
    id: 23,
    text: "What does an arrow function look like?",
    options: ["function myFunc() {}", "(x) => x * 2", "func(x) -> x * 2", "arrow myFunc(x)"],
    correctIndex: 1,
  },
  {
    id: 24,
    text: "What does this code output?\n\nconst numbers = [1, 2, 3];\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled);",
    options: ["[1, 2, 3]", "[2, 4, 6]", "[1, 4, 9]", "Error"],
    correctIndex: 1,
  },
  {
    id: 25,
    text: "Why use .map() in JavaScript?",
    options: ["To change each item in an array", "To find the largest number", "To delete items", "To shuffle items"],
    correctIndex: 0,
  },
]
