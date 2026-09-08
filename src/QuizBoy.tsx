import { useState, type FC } from 'react';
import './QuizBoy.scss';

interface QuestionData {
  text: string;
  options: string[];
  correctAnswer: string;
}

export const QuizBoy: FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [audio] = useState<HTMLAudioElement>(() => new Audio('./sound.mp3'));

  const questionData: QuestionData = {
    text: 'W jakiego uwielbianego przez Ojca dziecka bohatera z uniwersum Marvela wciela się Ryan Reynolds?',
    options: [
      'Green Lantern',
      'Thor',
      'Deadpool',
      'Kapitan Ameryka'
    ],
    correctAnswer: 'Deadpool'
  };

  const handleAnswerSelect = (option: string): void => {
    setSelectedAnswer(option);
    if (option === questionData.correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
      setSelectedAnswer(null);
    }, 2000);
    }
  };

  const handlePlayMusic = (): void => {
    if (!isPlaying) {
      setIsPlaying(true);
      audio.play().catch((err: Error) => console.error('Błąd odtwarzania muzyki:', err));
    }
  };

  return (
    <div className="quiz-container">
      {!isCorrect ? (
        <div className="question-box">
          <h2 className="question-text">{questionData.text}</h2>

          <div className="options-grid">
            {questionData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`option-btn ${selectedAnswer === option ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>

          {selectedAnswer && !isCorrect && (
            <p className="error-message">Gupiś!</p>
          )}
        </div>
      ) : (
        <div className="reveal-box">
            {!isPlaying && (
                <>
                    <h2>To jest poprawna odpowiedź!</h2>
                    <p style={{ marginBottom: '20px', color: '#666' }}>Naciśnij przycisk poniżej, aby poznać płeć!</p>
                </>
            )}
          
        {!isPlaying && (
            <button
            onClick={handlePlayMusic}
            className={`play-btn ${isPlaying ? 'playing' : ''}`}
          >
            {isPlaying ? '' : 'Odkryj!'}
          </button>
        )}

          {/* Napis pojawia się wyłącznie wtedy, gdy muzyka zacznie grać */}
          {isPlaying && (
            <>
            <h1 className="reveal-title">
              BĘDZIE CHŁOPIEC!
            </h1>
            <img src="./image.jpg"></img>
            </>
          )}
        </div>
      )}
    </div>
  );
};