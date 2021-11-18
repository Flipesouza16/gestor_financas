export const mascaraMoedaReal = (moeda: any) => {
  let moedaFormatada = moeda.replace(/\D/g, '');
  moedaFormatada = (moedaFormatada / 100)
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(\d{3})(\d{3}),/g, '$1.$2.$3,')
    .replace(/(\d)(\d{3}),/g, '$1.$2,');
  return moedaFormatada;
};
