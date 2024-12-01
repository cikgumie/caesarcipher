import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";

const CipherTab = () => {
  const [rotation, setRotation] = useState(0);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encrypt');
  
  const alphabet = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  const resetFields = () => {
    setInputText('');
    setOutputText('');
    setRotation(0);
  };

  const processText = (text, encrypt = true) => {
    text = text.toUpperCase();
    let result = '';
    
    for (let char of text) {
      if (alphabet.includes(char)) {
        let index = alphabet.indexOf(char);
        let shift = encrypt ? rotation : -rotation;
        let newIndex = (index + shift + 26) % 26;
        result += alphabet[newIndex];
      } else {
        result += char;
      }
    }
    
    return result;
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetFields();
  };

  const handleProcess = () => {
    if (inputText.trim() !== '') {
      setOutputText(processText(inputText, mode === 'encrypt'));
    }
  };

  const getShiftedAlphabet = () => {
    const shift = mode === 'encrypt' ? rotation : -rotation;
    return alphabet.map((_, index) => {
      const newIndex = (index + shift + 26) % 26;
      return alphabet[newIndex];
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-md p-4">
        <h2 className="text-center font-medium text-gray-800">Caesar Cipher</h2>
      </div>

      {/* Character visualization with labels */}
      <div className="space-y-1">
        <div className="text-sm text-gray-600 mb-1">Aksara Teks Biasa:</div>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-26 gap-0 text-center border rounded-lg min-w-[520px] border-gray-200">
            {alphabet.map((letter) => (
              <div key={`original-${letter}`} className="bg-white p-1 sm:p-2 border-r border-gray-200 text-xs sm:text-base font-medium">
                {letter}
              </div>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="grid grid-cols-26 gap-0 text-center h-6 min-w-[520px]">
            {alphabet.map((_, index) => (
              <div key={`arrow-${index}`} className="text-blue-500">↓</div>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-1">Aksara Teks Caesar:</div>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-26 gap-0 text-center border rounded-lg min-w-[520px] border-gray-200">
            {getShiftedAlphabet().map((letter) => (
              <div key={`shifted-${letter}`} className="bg-gray-50 p-1 sm:p-2 border-r border-gray-200 text-xs sm:text-base font-medium">
                {letter}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-center font-medium">
          Anjakan: <span className="text-blue-500">{rotation}</span> 
        </div>
        <Slider
          value={[rotation]}
          onValueChange={(value) => setRotation(value[0])}
          max={25}
          step={1}
          className="w-full"
        />
      </div>

      <div className="flex justify-center gap-4">
        <Button
          className={mode === 'encrypt' ? 'bg-[#10172a] text-white hover:bg-[#1a2942]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
          onClick={() => handleModeChange('encrypt')}
        >
          Sulitkan
        </Button>
        <Button
          className={mode === 'decrypt' ? 'bg-[#10172a] text-white hover:bg-[#1a2942]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
          onClick={() => handleModeChange('decrypt')}
        >
          Nyahsulit
        </Button>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block mb-2">Teks Masukan:</label>
          <textarea
            className="w-full p-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={3}
            placeholder={`Masukkan teks untuk di${mode === 'encrypt' ? 'sulitkan' : 'nyahsulit'}`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
        <Button 
          onClick={handleProcess} 
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {mode === 'encrypt' ? 'Sulitkan Teks' : 'Nyahsulit Teks'}
        </Button>
        <div>
          <div className="flex justify-between mb-2">
            <label>Teks Keluaran:</label>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => navigator.clipboard.writeText(outputText)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Salin
            </Button>
          </div>
          <textarea
            className="w-full p-2 border rounded-lg resize-none bg-gray-50"
            rows={3}
            readOnly
            value={outputText}
          />
        </div>
      </div>
    </div>
  );
};

const PracticeTab = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  
  const generateQuestion = () => {
    const plainText = ['HELLO', 'WORLD', 'CIPHER', 'SECRET', 'CODE'][Math.floor(Math.random() * 5)];
    const shift = Math.floor(Math.random() * 25) + 1;
    const isEncrypt = Math.random() > 0.5;
    
    const cipherText = plainText.split('').map(char => {
      const index = char.charCodeAt(0) - 65;
      const newIndex = ((index + shift) % 26 + 26) % 26;
      return String.fromCharCode(newIndex + 65);
    }).join('');

    return {
      question: isEncrypt ? plainText : cipherText,
      answer: isEncrypt ? cipherText : plainText,
      shift,
      isEncrypt
    };
  };

  const startNewQuestion = () => {
    setCurrentQuestion(generateQuestion());
    setUserAnswer('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    const isCorrect = userAnswer.toUpperCase() === currentQuestion.answer;
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? 
        'Betul! Tahniah!' : 
        `Salah. Jawapan yang betul ialah ${currentQuestion.answer}`
    });
    setScore(prev => isCorrect ? prev + 1 : prev);
    setTotalAttempts(prev => prev + 1);
  };

  useEffect(() => {
    if (!currentQuestion) startNewQuestion();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-md p-4">
        <h2 className="text-center font-medium text-gray-800">Mod Latihan</h2>
      </div>

      <div className="text-center">
        <div className="text-gray-600 mb-4">
          Skor: <span className="font-medium text-blue-500">{score}</span>/{totalAttempts} 
          ({totalAttempts > 0 ? Math.round((score/totalAttempts) * 100) : 0}%)
        </div>
      </div>

      {currentQuestion && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="font-medium mb-2 text-gray-700">
              {currentQuestion.isEncrypt ? 'Sulitkan' : 'Nyahsulit'} teks ini menggunakan anjakan {currentQuestion.shift}:
            </div>
            <div className="text-2xl font-bold text-center text-blue-600">
              {currentQuestion.question}
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Masukkan jawapan anda"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
            <Button 
              onClick={checkAnswer} 
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Semak Jawapan
            </Button>
          </div>

          {feedback && (
            <div className={`p-4 rounded-lg ${feedback.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {feedback.message}
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={startNewQuestion} 
            className="w-full border-2"
          >
            Soalan Seterusnya
          </Button>
        </div>
      )}
    </div>
  );
};

const CaesarCipher = () => {
  return (
    <div className="max-w-2xl mx-auto mt-2">
      <Card className="shadow-lg">
        <Tabs defaultValue="cipher">
          <TabsList className="w-full grid grid-cols-2 p-1 bg-gray-100 rounded-t-lg">
            <TabsTrigger 
              value="cipher" 
              className="data-[state=active]:bg-white rounded-sm"
            >
              Caesar
            </TabsTrigger>
            <TabsTrigger 
              value="practice"
              className="data-[state=active]:bg-white rounded-sm"
            >
              Latihan
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cipher" className="p-4">
            <CipherTab />
          </TabsContent>
          
          <TabsContent value="practice" className="p-4">
            <PracticeTab />
          </TabsContent>
        </Tabs>
      </Card>

      <style jsx global>{`
        .grid-cols-26 {
          grid-template-columns: repeat(26, minmax(0, 1fr));
        }
      `}</style>
    </div>
  );
};

export default CaesarCipher;