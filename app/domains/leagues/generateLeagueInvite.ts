export const generateLeagueInviteCode = () => {
  let s = '';
  const length = 6;
  Array.from({ length }).some(() => {
    s += Math.random().toString(36).slice(2);
    return s.length >= length;
  });
  return s.slice(0, length);
};