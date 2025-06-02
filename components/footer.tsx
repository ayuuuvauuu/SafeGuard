import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-4 px-4 border-t border-gray-800 text-center text-sm text-gray-400 bg-black">
      <div className="container">
        <p className="font-medium">SafeGuard - Your personal safety companion</p>
        <p className="text-xs mt-1">
          Developed by <span className="font-semibold">Akshat Bhardwaj and Ayush Mishra</span>
        </p>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Use
          </Link>
          <Link href="/help" className="hover:underline">
            Help & Support
          </Link>
        </div>
      </div>
    </footer>
  )
}
