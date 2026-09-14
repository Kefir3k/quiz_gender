import { useState, useEffect, type FC } from 'react';
import './QuizBoy.scss';

interface QuestionData {
  text: string;
  options: string[];
  correctAnswer: string;
}

const questionsData: QuestionData[] = [
  {
    text: 'W jakiego uwielbianego przez Ojca dziecka bohatera z uniwersum Marvela wciela się Ryan Reynolds?',
    options: ['Green Lantern', 'Thor', 'Deadpool', 'Kapitan Ameryka'],
    correctAnswer: 'Deadpool'
  },
  {
    text: 'Pytanie 2: Jaki jest ulubiony kolor przprzyszłej mamy?',
    options: ['Różowy', 'Niebieski', 'Zielony', 'Żółty'],
    correctAnswer: 'Różowy'
  },
  {
    text: 'Pytanie 3: W którym miesiącu przewidywany jest termin porodu?',
    options: ['Maj', 'Czerwiec', 'Lipiec', 'Sierpień'],
    correctAnswer: 'Czerwiec'
  },
  {
    text: 'Pytanie 4: Ile trwa ciąża u człowieka (w tygodniach)?',
    options: ['36', '40', '42', '38'],
    correctAnswer: '40'
  },
  {
    text: 'Pytanie 5: Jaki jest pierwszy zmysł, który rozwija się u dziecka?',
    options: ['Wzrok', 'Dotyk', 'Słuch', 'Smak'],
    correctAnswer: 'Dotyk'
  },
  {
    text: 'Pytanie 6: Co jest niezbędne w wyprawce do szpitala?',
    options: ['Pieluszki', 'PlayStation', 'Garnitur', 'Książka'],
    correctAnswer: 'Pieluszki'
  },
  {
    text: 'Pytanie 7: Jak nazywa się pierwsze mleko matki?',
    options: ['Młodziwo (Siara)', 'Formuła', 'Śmietanka', 'Kefir'],
    correctAnswer: 'Młodziwo (Siara)'
  },
  {
    text: 'Pytanie 8: Ile kości ma noworodek?',
    options: ['206', 'Ok. 300', '150', '500'],
    correctAnswer: 'Ok. 300'
  },
  {
    text: 'Pytanie 9: Kiedy dziecko zazwyczaj zaczyna gaworzyć?',
    options: ['W 1. miesiącu', 'Około 6. miesiąca', 'W 12. miesiącu', 'Od razu po urodzeniu'],
    correctAnswer: 'Około 6. miesiąca'
  },
  {
    text: 'Pytanie 10: Ostatnie pytanie: Czy jesteście gotowi na poznanie cyfry?',
    options: ['TAK!', 'Nie', 'Chyba tak', 'Jeszcze raz'],
    correctAnswer: 'TAK!'
  }
];

export const QuizBoy: FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Muzyka w tle podczas rozwiązywania quizu
  const [bgAudio] = useState<HTMLAudioElement>(() => {
    const audio = new Audio('./bg-sound.mp3');
    audio.loop = true;
    return audio;
  });

  // Muzyka po odkryciu cyfry na samym końcu
  const [revealAudio] = useState<HTMLAudioElement>(() => new Audio('./sound.mp3'));

  const currentQuestion = questionsData[currentIndex];

  useEffect(() => {
    const playPromise = bgAudio.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const handleFirstInteraction = () => {
          bgAudio.play();
          window.removeEventListener('click', handleFirstInteraction);
        };
        window.addEventListener('click', handleFirstInteraction);
      });
    }

    return () => {
      bgAudio.pause();
      bgAudio.currentTime = 0;
    };
  }, [bgAudio]);

  const stopBgMusic = (): void => {
    bgAudio.pause();
    bgAudio.currentTime = 0;
  };

  const handleAnswerSelect = (option: string): void => {
    setSelectedAnswer(option);

    if (option === currentQuestion.correctAnswer) {
      setTimeout(() => {
        setSelectedAnswer('');
        if (currentIndex + 1 < questionsData.length) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          stopBgMusic();
          setIsQuizCompleted(true);
        }
      }, 500);
    } else {
      setTimeout(() => {
        setSelectedAnswer('');
      }, 2000);
    }
  };

  const handlePlayMusic = (): void => {
    if (!isPlaying) {
      setIsPlaying(true);
      revealAudio.play().catch((err: Error) => console.error('Błąd odtwarzania muzyki końcowej:', err));
    }
  };

  return (
    <div className="quiz-container">
      {!isQuizCompleted ? (
        <div className="question-box">
          <p className="question-progress">
            Pytanie {currentIndex + 1} z {questionsData.length}
          </p>
          <h2 className="question-text">{currentQuestion.text}</h2>

          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`option-btn ${selectedAnswer === option ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>

          {selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer && (
            <p className="error-message">Gupiś!</p>
          )}
        </div>
      ) : (
        <div className="reveal-box">
          {!isPlaying && (
            <>
              <h2>Gratulacje! Odpowiedziałeś na wszystkie pytania!</h2>
              <p style={{ marginBottom: '20px', color: '#666' }}>
                Naciśnij przycisk poniżej, aby poznać ostatnią cyfrę do kłódki!
              </p>
              <button
                onClick={handlePlayMusic}
                className="play-btn"
              >
                Pokaż ostatnią cyfrę!
              </button>
            </>
          )}

          {isPlaying && (
            <>
              <h1 className="reveal-title">
                OSTATNIA CYFRA DO KŁÓDKI TO:
              </h1>
              <p className="last_number">1</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};