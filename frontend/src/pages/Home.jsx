export default function Home() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4e0bba] to-[#d8f405] flex flex-col items-center justify-center text-center text-white px-8">
        <h1 className="text-5xl font-bold mb-4">Welcome to AI Glow</h1>
        <p className="text-lg text-white/90 max-w-2xl mb-10">
          Discover, learn, and create with the power of AI — your journey starts here.
        </p>
  
        <div className="flex gap-6">
          <a
            href="/login"
            className="bg-white text-[#4e0bba] font-semibold py-3 px-6 rounded-md shadow-md hover:bg-[#4e0bba] hover:text-white transition-all duration-300"
          >
            Login
          </a>
          <a
            href="#about"
            className="border border-white/70 text-white font-semibold py-3 px-6 rounded-md hover:bg-white hover:text-[#4e0bba] transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
    );
  }
  