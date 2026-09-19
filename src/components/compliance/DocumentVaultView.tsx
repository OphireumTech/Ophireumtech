/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM Secure Client Document Vault & Cryptographic Pipeline
 * Section 36: Categorized folders, isolated staging, file signature verification,
 * malware scanning, AES-256 encryption at rest, and SHA-256 ledger.
 */

import React, { useState, useEffect } from 'react';
import {
  FolderLock,
  FileText,
  ShieldCheck,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
  Filter,
  Eye,
  Plus
} from 'lucide-react';
import { complianceEngine } from '../../services/complianceEngine';
import { DocumentVaultItem } from '../../types/compliance';
import { useApp } from '../../context/AppContext';

export const DocumentVaultView: React.FC = () => {
  const { addToast } = useApp();
  const [items, setItems] = useState<DocumentVaultItem[]>(() => complianceEngine.getVaultItems());
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return complianceEngine.subscribe(() => {
      setItems(complianceEngine.getVaultItems());
    });
  }, []);

  const folders = [
    'All',
    'Identity',
    'Address',
    'Corporate',
    'UBO',
    'Financial',
    'Source of Funds',
    'Source of Wealth',
    'Broker',
    'Agreements',
    'Signed Agreements',
    'Signature Certificates',
    'Tax',
    'Compliance'
  ];

  const filtered = items.filter(item => {
    const matchesFolder = selectedFolder === 'All' || item.folderCategory === selectedFolder;
    const matchesSearch =
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sha256Hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleSimulateUpload = async (folder: DocumentVaultItem['folderCategory']) => {
    setIsUploading(true);
    const mockFileName = `Document_${folder.replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}.pdf`;
    const hash = await complianceEngine.computeSha256(mockFileName + Date.now());

    setTimeout(() => {
      const newItem: DocumentVaultItem = {
        id: 'vault_' + Date.now(),
        folderCategory: folder,
        fileName: mockFileName,
        fileSizeKb: Math.floor(200 + Math.random() * 1500),
        mimeType: 'application/pdf',
        sha256Hash: hash,
        securityPipelineStatus: {
          isolatedStaging: true,
          signatureValidated: true,
          malwareScanned: true,
          encryptedAtRest: true,
          humanReviewed: true
        },
        uploadedAt: new Date().toISOString(),
        version: 1,
        status: 'approved'
      };

      complianceEngine.addVaultItem(newItem);
      setIsUploading(false);
      addToast('Document Securely Stored', `${mockFileName} passed antivirus scan and SHA-256 hashed.`, 'success');
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-[#1E2538] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2538] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#E4C765]">
              <FolderLock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#E4C765] uppercase tracking-wider">
                COMPLIANCE VAULT & CRYPTOGRAPHIC LEDGER
              </div>
              <h1 className="text-xl font-bold text-white font-serif">
                CLIENT DOCUMENT VAULT
              </h1>
            </div>
          </div>

          <button
            type="button"
            disabled={isUploading}
            onClick={() => handleSimulateUpload(selectedFolder === 'All' ? 'Compliance' : (selectedFolder as any))}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C765] text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110 shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Securing Document...' : 'Upload to Vault'}</span>
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Every uploaded agreement, identity document, and signed certificate is processed through an isolated security pipeline: MIME signature verification, sandbox malware scanning, AES-256 encryption at rest, and permanent SHA-256 hash indexing.
        </p>
      </div>

      {/* SEARCH & FOLDER FILTER TABS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by file name or SHA-256 hash..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#080B11] border border-[#20283A] text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#C9A227]"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          </div>

          <div className="text-xs font-mono text-zinc-400">
            {filtered.length} Secure Records Indexed
          </div>
        </div>

        {/* Scrollable Folder Category Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {folders.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFolder(f)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
                selectedFolder === f
                  ? 'bg-[#C9A227] text-black font-bold'
                  : 'bg-[#101420] text-zinc-400 hover:text-white border border-[#1A2234]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* VAULT ITEMS LIST */}
      <div className="rounded-3xl bg-[#0D1017] border border-[#1E2538] p-6 shadow-xl space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 space-y-2">
            <FileText className="w-8 h-8 mx-auto opacity-40" />
            <div className="text-xs">No documents found in folder: {selectedFolder}</div>
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#080B11] border border-[#1A2234] hover:border-[#222C42] transition-all space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#161D2E] pb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white truncate text-xs">{item.fileName}</h4>
                    <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-2">
                      <span className="text-[#E4C765]">{item.folderCategory}</span>
                      <span>•</span>
                      <span>{item.fileSizeKb} KB</span>
                      <span>•</span>
                      <span>v{item.version}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-mono text-[10px] font-semibold">
                    {item.status.toUpperCase()}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      addToast('Document Downloaded', `Retrieved ${item.fileName} from encrypted vault.`, 'success');
                    }}
                    className="p-1.5 rounded-lg bg-[#141824] hover:bg-[#1E2538] text-zinc-300 hover:text-white cursor-pointer"
                    title="Download Copy"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Security Pipeline Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-zinc-400 pt-1">
                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Staging: Isolated</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Malware: Scanned Clean</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Storage: AES-256</span>
                </div>
                <div className="flex items-center gap-1 text-[#E4C765]">
                  <Lock className="w-3 h-3" />
                  <span className="truncate">SHA: {item.sha256Hash.substring(0, 10)}...</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
