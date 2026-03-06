import { useState, useRef } from "react";

function VoiceRecorder({ setComplaintText, language }) {
  const [recording, setRecording] = useState(false);
  const [finalText, setFinalText] = useState("");
  const recognitionRef = useRef(null);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language; // use selected language
    recognition.interimResults = false; // only final results
    recognition.continuous = false; // stop automatically after stopRecording

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFinalText(transcript);
      setComplaintText(transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>

     
    </div>
  );
}

export default VoiceRecorder;