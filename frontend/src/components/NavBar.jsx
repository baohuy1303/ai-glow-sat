import logo from "../assets/aiglow_logo.png";

export default function NavBar() {
    return (
      <nav className="flex items-center justify-between px-10 py-4 bg-[#5B00D2] text-white">
        <img src={logo} alt="Login Background" className="w-13 max-w-md rounded shadow-lg"></img>
  
        <div className="flex gap-8 text-lg">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            Take a Test
          </a>
          <a href="#" className="hover:underline">
            Upload Test
          </a>
          <a href="/question-bank" className="hover:underline">
            Question Bank
          </a>
        </div>
  
        <div className="flex gap-4">
          <button href="#login" className="bg-[#e5ff00] text-[#5B00D2] font-semibold px-5 py-2 rounded-full hover:bg-[#d6ef00] transition">
            Login
          </button>
          <button href="#signup" className="bg-[#e5ff00] text-[#5B00D2] font-semibold px-5 py-2 rounded-full hover:bg-[#d6ef00] transition">
            Signup
          </button>
        </div>
      </nav>
    );
  }
  