/* Regex per la validazione dell'input */
export class Validations {
  public static cfpattern = '^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$';
  public static emailpattern = '^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,4}$';
  public static password = '(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)';
  public static password2 = '^.*$[a-z]+^.*$[A-Z]+^.*$[0-9]';
  public static passwordpattern = '';
}
