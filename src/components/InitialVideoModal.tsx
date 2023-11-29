import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InitialVideoModalProps {
  children?: React.ReactNode;
}

const useLocalStorage = (key: string, initialValue: string) => {
  const [storedValue, setStoredValue] = useState<string>(
    localStorage.getItem(key) ?? initialValue,
  );

  const setValue = (value: string) => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(item);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
        setStoredValue(value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
};

const InitialVideoModal: React.FC<InitialVideoModalProps> = () => {
  const [firstLogin, setFirstLogin] = useLocalStorage("firstLogin", "false");

  return (
    <div>
      <AlertDialog open={firstLogin == "false"}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¡Bienvenido a SmartHome Automator!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Este es un pequeño video introductorio para que puedas conocer
              como funciona la aplicación.{" "}
              <u>
                Este video siempre estará disponible más tarde en configuración
              </u>
              <div className="pt-4">
                <iframe
                  className="aspect-video w-full rounded-md shadow-xl"
                  src="https://www.youtube.com/embed/PacOhX3ynJI?si=jsRmWMFeLnGigXdg"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setFirstLogin("true")}>
              Continuar a la App
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InitialVideoModal;
