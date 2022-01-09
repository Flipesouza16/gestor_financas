import { UserService } from '../services/user/user.service';
import { appInjector } from './app-injector';

export const mascaraMoedaReal = (moeda: any) => {
  let moedaFormatada = moeda.replace(/\D/g, '');
  moedaFormatada = (moedaFormatada / 100)
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(\d{3})(\d{3}),/g, '$1.$2.$3,')
    .replace(/(\d)(\d{3}),/g, '$1.$2,');
  return moedaFormatada;
};

export const capitalizeFirstLetter = (text: string) => {
  if(text.includes(' ')) {
    const listOfTexts = text.split(' ');
    let textToReturn = '';
    for(const textSplitted of listOfTexts) {
      textToReturn += textSplitted.charAt(0).toUpperCase() + textSplitted.slice(1) + ' ';
    }
    return textToReturn.trim();
  } else {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
};

export const monthNames = [
  'january', //0
  'february', //1
  'march', //2
  'april', //3
  'may', //4
  'june', //5
  'july', //6
  'august', //7
  'september', //8
  'october', //9
  'november', //10
  'december', //11
];

export const monthTranslatedNames = {
  january: 'Janeiro',
  february: 'Fevereiro',
  march: 'Março',
  april: 'Abril',
  may: 'Maio',
  june: 'Junho',
  july: 'Julho',
  august: 'Agosto',
  september: 'Setembro',
  october: 'Outubro',
  november: 'Novembro',
  december: 'Dezembro',
};

export const generateHash = (length = 16) => {
  const userCtrl = appInjector.get(UserService);
  const idUser = userCtrl.idUser;

  let retorno = '';
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-=_!#$*?~/';

  for (let i = 0; i < length; i++) {
    retorno += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return retorno + '@' + idUser;
};
