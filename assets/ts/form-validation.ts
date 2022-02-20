const FormValidation = {
  isValidName(name: string) {
    const hasNoEmoji = /^\P{Emoji}{2,}$/u.test(name);
    const hasNoSpecialChars =
      /^[^\d.\\/><,~`":;{[\]!@#$%^&*()_+=|\t\n]{2,}$/.test(name);
    return hasNoEmoji && hasNoSpecialChars;
  },
};

export default FormValidation;
