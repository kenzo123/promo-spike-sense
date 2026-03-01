import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Zap, ArrowLeft } from "lucide-react";

export default function PageNotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center p-6"
      style={{ background: "#0F0F0F" }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
      >
        <Zap size={24} color="#fff" fill="#fff" />
      </div>
      <h1 className="text-6xl font-bold mb-3" style={{ color: "#F5F5F5" }}>404</h1>
      <p className="text-base mb-1 font-medium" style={{ color: "#F5F5F5" }}>Page not found</p>
      <p className="text-sm mb-8" style={{ color: "#888888" }}>
        This page doesn't exist or you don't have access to it.
      </p>
      <Link
        to={createPageUrl("Dashboard")}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium no-underline transition-all"
        style={{ background: "#6366F1", color: "#fff" }}
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>
    </div>
  );
}