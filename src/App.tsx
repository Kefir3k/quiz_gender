import { useState, type SubmitEvent, type ChangeEvent, type FC } from 'react';
import { QuizBoy } from './QuizBoy';
import './App.scss';

const App: FC = () => {
  const [pin, setPin] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  // Twój kod PIN (zachowuje początkowe zero '0305')
  const CORRECT_PIN: string = '012';

  const handlePinSubmit = (e: SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // Pozwala na wprowadzenie wyłącznie cyfr (0-9)
    const onlyNums = e.target.value.replace(/\D/g, '');
    setPin(onlyNums);
  };

  if (isUnlocked) {
    return <QuizBoy />;
  }

  return (
    <div className="accesscodebox">
      <h2>Wpisz kod dostępu</h2>
      <p>Wprowadź kod, aby odblokować quiz.</p>

      <form className="accessform" onSubmit={handlePinSubmit}>
        <input
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          maxLength={3}
          value={pin}
          onChange={handleInputChange}
          placeholder="000"
          className={`pin-input ${error ? 'error' : ''}`}
        />
        <br />
        <button type="submit">Odblokuj</button>
      </form>

      {error && (
        <p className="error-message">Niepoprawny kod! Spróbuj ponownie.</p>
      )}
    </div>
  );
};

export default App;