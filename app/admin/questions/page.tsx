"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Loader2, MessageSquare, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminQuestionsPage() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await api.get("/api/questions");
            if (res.data.success) {
                console.log("Fetched Questions:", res.data.data);
                setQuestions(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch questions", error);
        } finally {
            setLoading(false);
        }
    };

    const [replyingId, setReplyingId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleReplyClick = (q: any) => {
        setReplyingId(q._id);
        setReplyText(q.answer || "");
    };

    const submitReply = async () => {
        if (!replyingId || !replyText.trim()) return;
        setSubmitting(true);
        try {
            const res = await api.patch(`/api/questions/${replyingId}`, { answer: replyText });
            if (res.data.success) {
                // Update local state
                setQuestions(questions.map(q => q._id === replyingId ? res.data.data : q));
                setReplyingId(null);
                setReplyText("");
                alert("Reply sent successfully");
            }
        } catch (error) {
            console.error("Failed to submit reply", error);
            alert("Failed to submit reply");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Product Inquiries</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-4 font-bold border-b border-gray-200 dark:border-gray-600">Product</th>
                            <th className="p-4 font-bold border-b border-gray-200 dark:border-gray-600">User</th>
                            <th className="p-4 font-bold border-b border-gray-200 dark:border-gray-600">Question</th>
                            <th className="p-4 font-bold border-b border-gray-200 dark:border-gray-600">Contact</th>
                            <th className="p-4 font-bold border-b border-gray-200 dark:border-gray-600">Date</th>
                            <th className="p-4 font-bold border-b border-gray-200 dark:border-gray-600">Status</th>
                            <th className="p-4 font-bold border-b border-gray-200 dark:border-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-500">No questions found.</td></tr>
                        ) : (
                            questions.map((q) => (
                                <React.Fragment key={q._id}>
                                    <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {(q.product?.image || q.product?.images?.[0]) && (
                                                    <img src={q.product.image || q.product.images[0]} className="w-10 h-10 object-cover rounded" />
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm line-clamp-1">{q.product?.name || "Unknown Product"}</span>
                                                    {q.product?.slug ? (
                                                        <Link href={`/product/${q.product.slug}`} target="_blank" className="text-xs text-primary flex items-center gap-1 hover:underline">
                                                            View Product <ExternalLink size={10} />
                                                        </Link>
                                                    ) : <span className="text-xs text-red-500">Product invalid</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium">{q.name}</div>
                                            <div className="text-xs text-gray-500">{q.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 max-w-xs">{q.message}</p>
                                            {q.answer && (
                                                <div className="mt-2 text-xs bg-green-50 text-green-800 p-2 rounded border border-green-200">
                                                    <strong>Admin Reply:</strong> {q.answer}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 font-mono text-sm">{q.mobile}</td>
                                        <td className="p-4 text-sm text-gray-500">{new Date(q.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${q.status === 'answered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {q.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleReplyClick(q)}
                                                className="text-xs bg-black text-white px-3 py-1 rounded hover:opacity-80 transition-opacity"
                                            >
                                                {q.answer ? "Update Reply" : "Reply"}
                                            </button>
                                        </td>
                                    </tr>
                                    {replyingId === q._id && (
                                        <tr className="bg-gray-50 dark:bg-gray-800/50">
                                            <td colSpan={7} className="p-4 border-b border-gray-100 dark:border-gray-700">
                                                <div className="flex gap-2">
                                                    <textarea
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        placeholder="Type your reply here..."
                                                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none min-h-[60px]"
                                                    />
                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            onClick={submitReply}
                                                            disabled={submitting}
                                                            className="bg-primary text-white px-4 py-2 rounded text-sm font-bold hover:bg-black disabled:opacity-50"
                                                        >
                                                            {submitting ? "Sending..." : "Send"}
                                                        </button>
                                                        <button
                                                            onClick={() => setReplyingId(null)}
                                                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-bold hover:bg-gray-300"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
