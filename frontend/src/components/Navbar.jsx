import logo from "../assets/aiglow_logo.png";

export default function Navbar() {
    return (
      <nav className="flex items-center justify-between px-10 py-4 bg-[#5B00D2] text-white">
        {/* Logo */}
        <img src={logo} alt="Login Background" className="w-13 max-w-md rounded shadow-lg"></img>
  
        {/* Navigation Links */}
        <div className="flex gap-8 text-lg">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            Take Test
          </a>
          <a href="#" className="hover:underline">
            Upload Test
          </a>
        </div>
      </nav>
    );
  }
  