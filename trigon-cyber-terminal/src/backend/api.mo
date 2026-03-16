import Storage "storage";

module Api {

  public type CompanyInfo = {
    company: Text;
    domain: Text;
    founder: Text;
    coFounder: Text;
    partner: Text;
    partnerCompany: Text;
    partnerWebsite: Text;
  };

  public type PartnerInfo = {
    organization: Text;
    representative: Text;
    website: Text;
  };

  public type SystemState = {
    version: Text;
    networkStatus: Text;
    securityMode: Text;
    timestamp: Int;
  };

  public func getCompanyInfo() : CompanyInfo {
    {
      company = "Trigon";
      domain = "Cybersecurity & Artificial Intelligence";
      founder = "G Mojesh";
      coFounder = "J Vinay";
      partner = "Y Sri Vardhan";
      partnerCompany = "Sripto";
      partnerWebsite = "sripto.tech";
    }
  };

  public func getPartner() : PartnerInfo {
    {
      organization = "Sripto";
      representative = "Y Sri Vardhan";
      website = "sripto.tech";
    }
  };

  public func getFeatures() : [Text] {
    [
      "AI Threat Detection",
      "Phishing Email Analyzer",
      "Malicious Link Scanner",
      "Steganography Detection",
      "Cyber Intelligence Engine",
      "Enterprise Security Dashboards"
    ]
  };

  public func getTools() : [Text] {
    [
      "Phishing Scanner",
      "Link Analyzer",
      "Steganography Detector",
      "Threat Intelligence Feed",
      "Vulnerability Scanner"
    ]
  };

  public func getSystemState() : SystemState {
    {
      version = "Trigon CyberOS v1.0";
      networkStatus = "Online";
      securityMode = "Active";
      timestamp = 0
    }
  };
};
