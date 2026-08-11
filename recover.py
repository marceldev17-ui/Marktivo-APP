import re

with open('src/components/CampaignBuilderView.tsx', 'r') as f:
    ruined_content = f.read()

voice_new = """export const VoiceInputBtn: React.FC<{ onResult: (text: string) => void }> = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef<any>(null);

  const toggleListen = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'pt-BR';
    // Using continuous = true so it doesn't stop immediately if the user pauses briefly
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript.trim()) {
        onResult(finalTranscript.trim());
      }
    };
    
    recognition.onspeechend = () => {
      // Don't auto stop on speech end if we want continuous listening,
      // but if the browser fires it, we handle it
    };

    recognition.onend = () => {
       setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
    };
    
    recognition.start();
  };"""

# split by voice_new
parts = ruined_content.split(voice_new)
recovered = "".join(parts)

with open('src/components/CampaignBuilderView.tsx', 'w') as f:
    f.write(recovered)

print("Recovered size:", len(recovered))
