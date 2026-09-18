import { useState, useEffect, type FC } from 'react';
import './QuizBoy.scss';

interface QuestionData {
  text: string;
  options: string[];
  correctAnswer: string;
}

const questionsData: QuestionData[] = [
  {
    text: 'Co ocenia skala Apgar u noworodka?',
    options: ['Stopień rozwoju neurologicznego dziecka w pierwszych minutach życia', 'Stan noworodka bezpośrednio po urodzeniu, m.in. oddech, czynność serca, napięcie mięśniowe, reakcję na bodźce i kolor skóry', 'Ryzyko wystąpienia wad wrodzonych na podstawie parametrów porodu', 'Wzrost, wagę oraz obwód głowy i klatki piersiowej noworodka'],
    correctAnswer: 'Stan noworodka bezpośrednio po urodzeniu, m.in. oddech, czynność serca, napięcie mięśniowe, reakcję na bodźce i kolor skóry'
  },
  {
    text: 'Co jest monitorowane podczas badania KTG?',
    options: ['Czynność serca płodu oraz czynność skurczowa macicy', 'Przepływ krwi przez łożysko oraz długość szyjki macicy', 'Ruchy płodu oraz poziom wód płodowych', 'Poziom dotlenienia płodu oraz ciśnienie tętnicze krwi matki'],
    correctAnswer: 'Czynność serca płodu oraz czynność skurczowa macicy'
  },
  {
    text: 'Określenie „czwarty trymestr” odnosi się do:',
    options: ['Ostatnich trzech miesięcy ciąży, kiedy dziecko intensywnie przybiera na masie', 'Pierwszych około trzech miesięcy życia dziecka po porodzie, traktowanych jako okres adaptacji zarówno dziecka, jak i rodziców', 'Okresu pomiędzy 40. a 43. tygodniem ciąży, kiedy poród jest najbardziej prawdopodobny', 'Okresu regeneracji organizmu kobiety tuż przed samym porodem'],
    correctAnswer: 'Pierwszych około trzech miesięcy życia dziecka po porodzie, traktowanych jako okres adaptacji zarówno dziecka, jak i rodziców'
  },
  {
    text: 'Co najczęściej oznacza skrót „MM” w kontekście żywienia niemowlęcia??',
    options: ['Mieszanka mineralna', 'Mleko matczyne', 'Mleko modyfikowane', 'Mączka migdałowa'],
    correctAnswer: 'Mleko modyfikowane'
  },
  {
    text: 'Które stwierdzenie dotyczące mleka modyfikowanego jest prawdziwe?',
    options: ['Jest produkowane wyłącznie na bazie mleka krowiego.', 'Jego skład jest regulowany, a mieszanki są dostosowywane do potrzeb żywieniowych niemowląt.', 'Może być podawane noworodkowi w dowolnym stężeniu, zależnie od jego apetytu.', 'Nie zawiera białek ani tłuszczów, aby ułatwić dziecku trawienie.'],
    correctAnswer: 'Jego skład jest regulowany, a mieszanki są dostosowywane do potrzeb żywieniowych niemowląt.'
  },
  {
    text: 'Która z poniższych odpowiedzi najlepiej opisuje rolę douli?',
    options: ['Jest osobą zapewniającą niemedyczne wsparcie emocjonalne, informacyjne i fizyczne kobiecie oraz jej bliskim w okresie okołoporodowym.', 'Jest specjalistką medyczną uprawnioną do samodzielnego prowadzenia porodu fizjologicznego.', 'Jest terapeutką zajmującą się wyłącznie przygotowaniem psychicznym kobiety do porodu.', 'Jest ratowniczką medyczną odpowiadającą za pierwszą pomoc medyczną noworodkowi.'],
    correctAnswer: 'Jest osobą zapewniającą niemedyczne wsparcie emocjonalne, informacyjne i fizyczne kobiecie oraz jej bliskim w okresie okołoporodowym.'
  },
  {
    text: 'Na czym polega kangurowanie noworodka?',
    options: ['Na masowaniu dziecka w celu pobudzenia jego układu krążenia.', 'Na zawijaniu dziecka w specjalny kokon imitujący warunki panujące w macicy.', 'Na bezpośrednim kontakcie „skóra do skóry” dziecka z rodzicem/opiekunem, zwykle położonego na klatce piersiowej.', 'Na delikatnym kołysaniu noworodka w nosidełku zwanym „kangurkiem”.'],
    correctAnswer: 'Na bezpośrednim kontakcie „skóra do skóry” dziecka z rodzicem/opiekunem, zwykle położonego na klatce piersiowej.'
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

  // efekty dźwiękowe po dobrej i błędnej odpowiedzi
  const [goodSound] = useState<HTMLAudioElement>(() => new Audio('./good-sound.mp3'));
  const [wrongSound] = useState<HTMLAudioElement>(() => new Audio('./wrong-sound.mp3'));

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

  const handleAnswerSelect = (option: string, e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.blur();
    setSelectedAnswer(option);

    if (option === currentQuestion.correctAnswer) {
      goodSound.currentTime = 0;
      goodSound.play().catch((err: Error) => console.error('Błąd odtwarzania dźwięku sukcesu:', err));

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
      wrongSound.currentTime = 0;
      wrongSound.play().catch((err: Error) => console.error('Błąd odtwarzania dźwięku pomyłki:', err));

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
                onClick={(e) => handleAnswerSelect(option, e)}
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
              <h2>Gratulacje! Odpowiedziałeś poprawnie na wszystkie pytania!</h2>
              <p style={{ marginBottom: '20px', color: '#666' }}>
                Naciśnij przycisk poniżej, aby poznać ostatnią cyfrę do kłódki!
              </p>
              <button
                onClick={handlePlayMusic}
                className="play-btn"
              >
                Pokaż ostatnią cyfrę do kłódki!
              </button>
            </>
          )}

          {isPlaying && (
            <>
              <h1 className="reveal-title">
                OSTATNIA CYFRA DO KŁÓDKI:
              </h1>
              <p className="last_number">7</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};