import './App.css'
import Calendar from './components/Calendar';
import { Toaster } from "sonner";

function App() {
  return (
    <div className="min-h-screen flex justify-center items-start p-10">
      <Calendar />
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App
