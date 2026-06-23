import { useState, useRef, useEffect } from 'react';
import { Send, Terminal } from 'lucide-react';

export default function ContactFrame() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(0); // 0: Name, 1: Email, 2: Message, 3: Review/Send, 4: Done

  const [history, setHistory] = useState([
    { text: 'Guest@NageshOS:~$ start_contact_sequence', type: 'command' },
    { text: 'Initializing secure connection...', type: 'output' },
    { text: 'System ready. Enter details to leave a message.', type: 'output' }
  ]);

  const [currentInput, setCurrentInput] = useState('');
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);
  const isFirstHistoryRender = useRef(true);

  // ✅ FIX: Keep terminal focus bound exclusively to user interaction steps (prevents jump on mount)
  useEffect(() => {
    if (step > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  // ✅ FIX: Prevent terminal box auto-scrolling until the user actively communicates
  useEffect(() => {
    if (isFirstHistoryRender.current) {
      isFirstHistoryRender.current = false;
      return;
    }
    if (step > 0 && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, step]);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const inputVal = currentInput.trim();
    if (!inputVal && step < 3) return;

    if (step === 0) {
      setName(inputVal);
      setHistory(prev => [
        ...prev,
        { text: `Enter your name: ${inputVal}`, type: 'input' },
        { text: `System: Hello ${inputVal}. Please provide your email address.`, type: 'output' }
      ]);
      setStep(1);
    } else if (step === 1) {
      // Basic email validation regex
      if (!/\S+@\S+\.\S+/.test(inputVal)) {
        setHistory(prev => [
          ...prev,
          { text: `Enter your email: ${inputVal}`, type: 'input' },
          { text: `Error: Invalid email format! Please try again.`, type: 'error' }
        ]);
        setCurrentInput('');
        return;
      }
      setEmail(inputVal);
      setHistory(prev => [
        ...prev,
        { text: `Enter your email: ${inputVal}`, type: 'input' },
        { text: `System: Perfect. Enter your message brief below:`, type: 'output' }
      ]);
      setStep(2);
    } else if (step === 2) {
      setMessage(inputVal);
      setHistory(prev => [
        ...prev,
        { text: `Enter your message: ${inputVal}`, type: 'input' },
        { text: `System: Ready to transmit message packet.`, type: 'output' },
        { text: `Packet Contents:`, type: 'output' },
        { text: `  Name    : ${name}`, type: 'output' },
        { text: `  Email   : ${email}`, type: 'output' },
        { text: `  Message : ${inputVal}`, type: 'output' }
      ]);
      setStep(3);
    }

    setCurrentInput('');
  };

  const [isSending, setIsSending] = useState(false);

  const handleTransmit = async () => {
    setIsSending(true);
    setHistory(prev => [
      ...prev,
      { text: `Guest@NageshOS:~$ send_packet --all`, type: 'command' },
      { text: `Transmitting...`, type: 'output' },
    ]);

    try {
      const formData = new FormData();
      formData.append('access_key', '05c2ce82-6a34-4469-9123-27e504da2794');
      formData.append('name', name);
      formData.append('email', email);
      formData.append('message', message);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setHistory(prev => [
          ...prev,
          { text: `Connection status: 200 OK.`, type: 'output' },
          { text: `Transmission complete! Thank you. I will reply shortly.`, type: 'success' },
        ]);
        setStep(4);
      } else {
        setHistory(prev => [
          ...prev,
          { text: `Error: ${data.message || 'Transmission failed. Please try again.'}`, type: 'error' },
        ]);
      }
    } catch {
      setHistory(prev => [
        ...prev,
        { text: `Error: Network failure. Check connection and retry.`, type: 'error' },
      ]);
    } finally {
      setIsSending(false);
    }
  };


  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setCurrentInput('');
    setStep(0);
    setHistory([
      { text: 'Guest@NageshOS:~$ reset_terminal', type: 'command' },
      { text: 'System ready. Enter details to leave a message.', type: 'output' }
    ]);
  };

  return (
    <div className="flex flex-col gap-4">
      
      {/* Console Header Bar */}
      <div className="flex justify-between items-center border-b-2 border-border-base pb-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-text-base">
          <Terminal size={14} className="text-pink" />
          <span>SECURE_SHELL_CONTACT.EXE</span>
        </div>
        
        {/* Mock window dots */}
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-border-base bg-pink" />
          <span className="w-2.5 h-2.5 rounded-full border border-border-base bg-canary" />
          <span className="w-2.5 h-2.5 rounded-full border border-border-base bg-mint" />
        </div>
      </div>

      {/* Terminal View Container - Added cursor-text and onClick behavior */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="bg-[#111111] border-2 border-border-base shadow-[3px_3px_0px_0px_var(--border-color)] p-4 font-mono text-xs md:text-sm text-[#e2e8f0] min-h-[250px] max-h-[300px] overflow-y-auto flex flex-col gap-2 cursor-text"
      >
        
        {/* History output logs */}
        <div className="flex flex-col gap-1.5">
          {history.map((log, idx) => {
            let colorClass = 'text-[#e2e8f0]';
            if (log.type === 'command') colorClass = 'text-[#ffe600] font-black';
            else if (log.type === 'input') colorClass = 'text-[#00ff66]';
            else if (log.type === 'error') colorClass = 'text-[#ff007a] font-bold';
            else if (log.type === 'success') colorClass = 'text-[#00ff66] font-bold';

            return (
              <div key={idx} className={`leading-relaxed whitespace-pre-wrap ${colorClass}`}>
                {log.text}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Input area */}
        {step < 3 && (
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-1.5 border-t border-dashed border-[#333333] pt-3 mt-auto">
            <span className="text-[#00ff66] font-bold shrink-0">
              {step === 0 ? 'Name: $' : step === 1 ? 'Email: $' : 'Message: $'}
            </span>
            <input
              ref={inputRef}
              type={step === 1 ? 'email' : 'text'}
              className="bg-transparent border-none outline-none text-[#e2e8f0] flex-1 font-mono text-xs md:text-sm caret-[#00ff66]"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder={
                step === 0 ? 'Type name and hit Enter...' : step === 1 ? 'Type email...' : 'Type message detail...'
              }
              autoComplete="off"
            />
          </form>
        )}
      </div>

      {/* Interactive Transmit Actions */}
      {step === 3 && (
        <div className="flex gap-4 mt-2">
          <button
            onClick={handleTransmit}
            disabled={isSending}
            className={`bg-mint text-black border-2 border-border-base font-heading font-black text-xs uppercase px-4 py-2.5 shadow-[3px_3px_0px_0px_var(--border-color)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border-color)] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center gap-1.5 transition-all ${isSending ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isSending ? 'TRANSMITTING...' : <>Transmit Packet <Send size={12} /></>}
          </button>
          <button
            onClick={handleReset}
            className="bg-pink text-black border-2 border-border-base font-heading font-black text-xs uppercase px-4 py-2.5 shadow-[3px_3px_0px_0px_var(--border-color)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border-color)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            Abort / Redo
          </button>
        </div>
      )}

      {step === 4 && (
        <button
          onClick={handleReset}
          className="self-start mt-2 bg-card-bg text-text-base border-2 border-border-base font-heading font-black text-xs uppercase px-4 py-2.5 shadow-[3px_3px_0px_0px_var(--border-color)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border-color)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          Start New Transmission
        </button>
      )}

      {/* Terminal status indicators */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed border-border-base text-[10px] font-mono text-text-base opacity-60">
        <span>ENCRYPTION: SH-256</span>
        <span>STATUS: ACTIVE_TERMINAL</span>
      </div>

    </div>
  );
}