function getWinner(p1, p2) {
    if (p1 === p2) return 'd';
    if (
        (p1 === 'Rock' && p2 === 'Scissor') ||
        (p1 === 'Paper' && p2 === 'Rock') ||
        (p1 === 'Scissor' && p2 === 'Paper')
    ) return 'p1';
    return 'p2';
}

module.exports = { getWinner };
