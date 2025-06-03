"use client";
import { useState } from 'react';

export default function ImageUploadForm() {
  const [ipfsHash, setIpfsHash] = useState<string>('');
  const [imageHash, setImageHash] = useState<string>('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = (e.target as HTMLFormElement).elements.namedItem('file') as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('file', file);

   
    const button = (e.target as HTMLFormElement).querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (button) {
        button.disabled = true;
        button.textContent = 'Uploading...';
    }

    try {
        const res = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        setIpfsHash(data.IpfsHash);
        setImageHash(data.imageHash);
    } catch (error) {
        console.error("Upload failed:", error);
        alert('Upload failed. Please try again.'); // Simple error feedback
        setIpfsHash(''); // Clear any previous hash on error
    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = 'Upload';
        }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4">
      <div className="w-full max-w-lg p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-700 dark:text-slate-200">
          Upload Image to IPFS
        </h1>

        <form onSubmit={handleUpload} encType="multipart/form-data" className="space-y-5">
          <div>
            <label htmlFor="file-upload" className="sr-only">Choose file</label>
            <input
              id="file-upload"
              type="file"
              name="file"
              accept="image/*"
              required
              className="block w-full text-sm text-slate-500 dark:text-slate-400
                         file:mr-4 file:py-2.5 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-sky-50 dark:file:bg-sky-700 file:text-sky-600 dark:file:text-sky-100
                         hover:file:bg-sky-100 dark:hover:file:bg-sky-600
                         file:transition-colors file:duration-150 file:cursor-pointer
                         border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-5 py-3 text-base font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-sky-500 rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload
          </button>
        </form>

        {ipfsHash && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-300 break-all">
              <span className="font-semibold text-slate-700 dark:text-slate-200">IPFS Hash:</span>{' '}
              <a
                href={`https://ipfs.io/ipfs/${ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 underline hover:no-underline transition-colors duration-150"
              >
                {ipfsHash}
              </a>
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Click the hash to view the image on IPFS.
            </p>
          </div>
        )}
        {imageHash && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-300 break-all">
              <span className="font-semibold text-slate-700 dark:text-slate-200">IMAGE Hash:</span>{' '}
              {imageHash}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              the hash of your image file
            </p>
          </div>
        )}
      </div>
      <footer className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        A simple IPFS Uploader
      </footer>
    </div>
  );
}