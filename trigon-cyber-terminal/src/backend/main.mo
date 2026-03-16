import Array "mo:base/Array";
import Storage "storage";
import Api "api";
import Security "security";

actor TrigonBackend {

  let storage = Storage.Storage();

  public shared query func getCompanyInfo() : async Api.CompanyInfo {
    Api.getCompanyInfo()
  };

  public shared query func getPartner() : async Api.PartnerInfo {
    Api.getPartner()
  };

  public shared query func getFeatures() : async [Text] {
    Api.getFeatures()
  };

  public shared query func getTools() : async [Text] {
    Api.getTools()
  };

  public shared query func getSystemState() : async Api.SystemState {
    let s = Api.getSystemState();
    {
      version = s.version;
      networkStatus = s.networkStatus;
      securityMode = s.securityMode;
      timestamp = 0
    }
  };

  public shared query func getProjects() : async [Storage.Project] {
    let projects = storage.getProjects();
    if (Array.size(projects) == 0) {
      [
        { id = "1"; name = "CyberOS Terminal Platform"; description = "Browser-based cyber defense terminal" },
        { id = "2"; name = "Trigon Threat Scanner"; description = "AI-powered threat detection" },
        { id = "3"; name = "AI Security Engine"; description = "Enterprise security analytics" }
      ]
    } else {
      projects
    }
  };

  public shared query func getServices() : async [Storage.Service] {
    let services = storage.getServices();
    if (Array.size(services) == 0) {
      [
        { id = "1"; name = "Threat Intelligence"; description = "Real-time threat analysis" },
        { id = "2"; name = "Phishing Detection"; description = "Email and link analysis" },
        { id = "3"; name = "Security Audits"; description = "Enterprise security assessments" }
      ]
    } else {
      services
    }
  };

  public shared query func getLogs() : async [Storage.LogEntry] {
    storage.getLogs(100)
  };

  public shared func storeMessage(name : Text, email : Text, message : Text) : async { #ok; #err : Text } {
    let safeName = Security.sanitizeInput(name);
    let safeEmail = Security.sanitizeInput(email);
    let safeMessage = Security.sanitizeInput(message);
    if (safeName == "" or safeEmail == "" or safeMessage == "") {
      return #err("All fields required")
    };
    if (not Security.validateEmail(safeEmail)) {
      return #err("Invalid email")
    };
    storage.addMessage(safeName, safeEmail, safeMessage);
    #ok
  };
}
