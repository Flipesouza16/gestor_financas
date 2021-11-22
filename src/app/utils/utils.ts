export const mascaraMoedaReal = (moeda: any) => {
  let moedaFormatada = moeda.replace(/\D/g, '');
  moedaFormatada = (moedaFormatada / 100)
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(\d{3})(\d{3}),/g, '$1.$2.$3,')
    .replace(/(\d)(\d{3}),/g, '$1.$2,');
  return moedaFormatada;
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
