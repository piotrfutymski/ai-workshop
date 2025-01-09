"use client";

import React, { useState } from 'react';
import { generateAIResponse1, generateAIResponseFull } from './aiService';

const Home = () => {
  const [inputText, setInputText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setUploadedFiles(filesArray);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponse('');

    try {
      const filesBase64 = await Promise.all(
        uploadedFiles.map((file) => fileToBase64(file))
      );

      const aiResponse = await generateAIResponseFull(filesBase64, inputText);
      setResponse(aiResponse);
    } catch (error) {
      console.error(error);
      setResponse('Wystąpił błąd podczas generowania odpowiedzi.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearResponse = () => {
    setResponse('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Co mam przygotować na Święta AI</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Wgraj zdjęcia lodówki / spiżarni:
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
          {uploadedFiles.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Wybrano {uploadedFiles.length} plików.
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Lub opisz zawartość spiżarni i podaj dodatkowe informacje:
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={4}
            placeholder="Np. jajka, mleko, masło..."
          ></textarea>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Generowanie...' : 'Generuj potrawy'}
        </button>
        {loading && (
          <div className="mt-4 text-center text-gray-500">
            <div className="loader animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            Generowanie odpowiedzi, proszę czekać...
          </div>
        )}
        {response && (
          <div className="mt-4 bg-green-100 text-green-800 p-4 rounded-lg relative">
            <button
              onClick={handleClearResponse}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
            <pre className="mt-2 whitespace-pre-wrap break-words">{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
