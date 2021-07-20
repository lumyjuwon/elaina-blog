import React, { useEffect, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { useRouter } from 'next/router';

interface Props {
  color: string;
}

export function ProgressBar(props: Props) {
  let progressPercent: number;
  let increaseProgressInterval: ReturnType<typeof setTimeout> | undefined;

  const router = useRouter();
  const [progress, setProgress] = useState<number>(0);

  function stopIncreaseProgress() {
    if (increaseProgressInterval) {
      clearInterval(increaseProgressInterval);
      increaseProgressInterval = undefined;
    }
    progressPercent = 20;
  }

  function startProgress() {
    stopIncreaseProgress();
    increaseProgressInterval = setInterval(() => {
      if (progressPercent < 40) {
        progressPercent += Math.floor(Math.random() * (5 - 3) + 3);
        setProgress(progressPercent);
      } else {
        // Need to casting
        clearInterval(increaseProgressInterval as unknown as number);
        increaseProgressInterval = undefined;
      }
    }, 500);

    setProgress(progressPercent);
  }

  function endProgress() {
    stopIncreaseProgress();
    setProgress(100);
  }

  useEffect(() => {
    const setProgressStart = () => {
      startProgress();
    };

    const setProgressEnd = () => {
      endProgress();
    };

    router.events.on('routeChangeStart', setProgressStart);
    router.events.on('routeChangeComplete', setProgressEnd);
    router.events.on('routeChangeError', setProgressEnd);

    return () => {
      router.events.off('routeChangeStart', setProgressStart);
      router.events.off('routeChangeComplete', setProgressEnd);
      router.events.off('routeChangeError', setProgressEnd);
    };
  }, []);

  return <LoadingBar color={props.color} progress={progress} waitingTime={300} transitionTime={150} shadow={false} />;
}
