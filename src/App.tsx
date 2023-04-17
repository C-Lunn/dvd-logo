import './App.css';
import Screensaver from './Screensaver';

function App() {
  return (
    <div className="App">
        <Screensaver imgsrc={'logo192.png'} width={200} speed={3} bgcolour="black" />
    </div>
  );
}

export default App;
