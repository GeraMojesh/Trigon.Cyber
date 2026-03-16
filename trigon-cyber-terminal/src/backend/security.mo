import Array "mo:base/Array";
import Text "mo:base/Text";

module Security {

  public func sanitizeInput(input: Text) : Text {
    let arr = Text.toArray(input);
    if (arr.size() > 2000) {
      let sub = Array.tabulate(2000, func(i) = arr[i]);
      Text.fromArray(sub)
    } else {
      input
    }
  };

  public func validateEmail(email: Text) : Bool {
    Text.contains(email, #char '@') and
    Text.contains(email, #text ".") and
    email.size() >= 5
  };
};
