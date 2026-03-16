import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Time "mo:base/Time";

module Storage {

  public type Message = {
    name: Text;
    email: Text;
    content: Text;
    timestamp: Int;
  };

  public type LogEntry = {
    level: Text;
    message: Text;
    timestamp: Int;
  };

  public type Project = {
    id: Text;
    name: Text;
    description: Text;
  };

  public type Service = {
    id: Text;
    name: Text;
    description: Text;
  };

  public class Storage() {
    var messages: [Message] = [];
    var logs: [LogEntry] = [];
    let projectsMap = HashMap.HashMap<Text, Project>(10, Text.equal, Text.hash);
    let servicesMap = HashMap.HashMap<Text, Service>(10, Text.equal, Text.hash);

    public func addMessage(name: Text, email: Text, content: Text) : () {
      let msg : Message = {
        name = name;
        email = email;
        content = content;
        timestamp = Time.now();
      };
      messages := Array.append(messages, [msg]);
      addLog("info", "New contact message from: " # name);
    };

    public func getMessages() : [Message] {
      messages
    };

    public func addLog(level: Text, message: Text) : () {
      let entry : LogEntry = {
        level = level;
        message = message;
        timestamp = Time.now();
      };
      logs := Array.append(logs, [entry]);
    };

    public func getLogs(limit: Nat) : [LogEntry] {
      let size = logs.size();
      if (size <= limit) {
        logs
      } else {
        Array.tabulate<LogEntry>(limit, func(i) = logs[size - limit + i])
      }
    };

    public func getProjects() : [Project] {
      Iter.toArray(projectsMap.vals())
    };

    public func setProjects(ps: [Project]) : () {
      for (p in ps.vals()) {
        projectsMap.put(p.id, p);
      }
    };

    public func getServices() : [Service] {
      Iter.toArray(servicesMap.vals())
    };

    public func setServices(ss: [Service]) : () {
      for (s in ss.vals()) {
        servicesMap.put(s.id, s);
      }
    };
  };
};
