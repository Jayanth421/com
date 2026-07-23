import { motion } from "framer-motion";
import { Download, Expand, FileText, MonitorUp, Minus, Plus, Printer, RotateCw, SkipBack, SkipForward } from "lucide-react";
import { useMemo, useState } from "react";
import { Modal } from "./modal";

type DocumentPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order: {
    studentName: string;
    rollNumber: string;
    department: string;
    section: string;
    className: string;
    subject: string;
    fileName: string;
    fileSize: string;
    pages: number;
    uploadedBy: string;
    uploadDate: string;
    previewType?: "pdf" | "docx" | "ppt" | "image";
  };
};

const viewerTypeMap = {
  pdf: "PDF Viewer",
  docx: "DOCX Viewer",
  ppt: "PPT Viewer",
  image: "Image Viewer",
};

export function DocumentPreviewModal({ isOpen, onClose, order }: DocumentPreviewModalProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [page, setPage] = useState(1);

  const pageMax = useMemo(() => Math.max(order.pages, 1), [order.pages]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-6xl rounded-[28px] border border-white/70 bg-white/95 p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-950/95" showCloseButton>
      <div className="max-h-[92vh] overflow-y-auto p-4 sm:p-5">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">Document Preview</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{order.fileName}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{viewerTypeMap[order.previewType ?? "pdf"]} • {order.fileSize}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setZoom((prev) => Math.max(75, prev - 10))} className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><Minus size={16} /></button>
            <button onClick={() => setZoom((prev) => Math.min(180, prev + 10))} className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><Plus size={16} /></button>
            <button onClick={() => setRotation((prev) => (prev + 90) % 360)} className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><RotateCw size={16} /></button>
            <button className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><Expand size={16} /></button>
            <button className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><Printer size={16} /></button>
            <button className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><Download size={16} /></button>
            <button className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><MonitorUp size={16} /></button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-900/50">
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><SkipBack size={16} /></button>
                <button onClick={() => setPage((prev) => Math.min(pageMax, prev + 1))} className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><SkipForward size={16} /></button>
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Page {page} / {pageMax}</p>
            </div>
            <div className="mt-4 flex min-h-[420px] items-center justify-center overflow-hidden rounded-[22px] border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
              <div
                className="flex min-h-[360px] w-full max-w-[680px] items-center justify-center rounded-[16px] bg-slate-100 p-6 text-center text-slate-600 transition-all dark:bg-slate-900 dark:text-slate-300"
                style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
              >
                <div className="space-y-2">
                  <FileText size={46} className="mx-auto text-indigo-500" />
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{order.fileName}</p>
                  <p className="text-sm">{viewerTypeMap[order.previewType ?? "pdf"]}</p>
                  <p className="text-xs text-slate-500">Document preview ready for review, zoom, rotate, and export.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-900/50">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">File Information</h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3"><span className="text-slate-500">File Name</span><span className="font-medium text-slate-900 dark:text-white">{order.fileName}</span></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">File Size</span><span className="font-medium text-slate-900 dark:text-white">{order.fileSize}</span></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">Number of Pages</span><span className="font-medium text-slate-900 dark:text-white">{order.pages}</span></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">Uploaded By</span><span className="font-medium text-slate-900 dark:text-white">{order.uploadedBy}</span></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">Upload Date</span><span className="font-medium text-slate-900 dark:text-white">{order.uploadDate}</span></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">Subject</span><span className="font-medium text-slate-900 dark:text-white">{order.subject}</span></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">Class</span><span className="font-medium text-slate-900 dark:text-white">{order.className}</span></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">Section</span><span className="font-medium text-slate-900 dark:text-white">{order.section}</span></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">Student Name</span><span className="font-medium text-slate-900 dark:text-white">{order.studentName}</span></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">Roll Number</span><span className="font-medium text-slate-900 dark:text-white">{order.rollNumber}</span></div>
              </div>
            </div>

            <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-900/50">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Print Actions</h4>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                {[
                  "Approve Print",
                  "Reject Print",
                  "Hold Print",
                  "Mark as Printing",
                  "Mark as Completed",
                  "Ready for Pickup",
                  "Assign Driver",
                  "Out for Delivery",
                  "Delivered",
                  "Cancel Order",
                  "Add Admin Notes",
                  "View Print History",
                  "View Status Timeline",
                ].map((action) => (
                  <button key={action} className="rounded-2xl bg-white px-3 py-2 text-left font-medium text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">{action}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
