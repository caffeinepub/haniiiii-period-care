import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";

actor {
  type Symptom = {
    name : Text;
    severity : Nat; // 1=mild, 2=moderate, 3=severe
  };

  type PeriodEntry = {
    id : Nat;
    startDate : Text;
    endDate : Text;
    symptoms : [Symptom];
    notes : Text;
    createdAt : Int;
  };

  module PeriodEntry {
    public func compareByCreatedAtDesc(entry1 : PeriodEntry, entry2 : PeriodEntry) : Order.Order {
      Int.compare(entry2.createdAt, entry1.createdAt);
    };
  };

  var nextId = 0;
  let entries = Map.empty<Nat, PeriodEntry>();

  public shared ({ caller }) func addPeriodEntry(startDate : Text, endDate : Text, notes : Text) : async Nat {
    let id = nextId;
    let entry : PeriodEntry = {
      id;
      startDate;
      endDate;
      symptoms = [];
      notes;
      createdAt = Time.now();
    };
    entries.add(id, entry);
    nextId += 1;
    id;
  };

  public shared ({ caller }) func updatePeriodEntry(id : Nat, startDate : Text, endDate : Text, notes : Text) : async Bool {
    switch (entries.get(id)) {
      case (null) { false };
      case (?existingEntry) {
        let updatedEntry = {
          existingEntry with
          startDate;
          endDate;
          notes;
        };
        entries.add(id, updatedEntry);
        true;
      };
    };
  };

  public shared ({ caller }) func deletePeriodEntry(id : Nat) : async Bool {
    if (entries.containsKey(id)) {
      entries.remove(id);
      true;
    } else {
      false;
    };
  };

  public query ({ caller }) func getAllPeriodEntries() : async [PeriodEntry] {
    entries.values().toArray().sort(PeriodEntry.compareByCreatedAtDesc);
  };

  public shared ({ caller }) func addSymptomToEntry(entryId : Nat, symptomName : Text, severity : Nat) : async Bool {
    if (severity < 1 or severity > 3) { Runtime.trap("Severity must be between 1 and 3") };

    switch (entries.get(entryId)) {
      case (null) { false };
      case (?entry) {
        let symptom : Symptom = { name = symptomName; severity };
        let updatedSymptoms = entry.symptoms.concat([symptom]);
        let updatedEntry = { entry with symptoms = updatedSymptoms };
        entries.add(entryId, updatedEntry);
        true;
      };
    };
  };

  public shared ({ caller }) func removeSymptomFromEntry(entryId : Nat, symptomName : Text) : async Bool {
    switch (entries.get(entryId)) {
      case (null) { false };
      case (?entry) {
        let filteredSymptoms = entry.symptoms.filter(
          func(symptom) {
            symptom.name != symptomName;
          }
        );
        let updatedEntry = { entry with symptoms = filteredSymptoms };
        entries.add(entryId, updatedEntry);
        true;
      };
    };
  };

  public shared ({ caller }) func updateSymptomSeverity(entryId : Nat, symptomName : Text, severity : Nat) : async Bool {
    if (severity < 1 or severity > 3) { Runtime.trap("Severity must be between 1 and 3") };

    switch (entries.get(entryId)) {
      case (null) { false };
      case (?entry) {
        var found = false;
        let updatedSymptoms = entry.symptoms.map(
          func(symptom) {
            if (symptom.name == symptomName) {
              found := true;
              { symptom with severity };
            } else {
              symptom;
            };
          }
        );
        if (found) {
          let updatedEntry = { entry with symptoms = updatedSymptoms };
          entries.add(entryId, updatedEntry);
          true;
        } else {
          false;
        };
      };
    };
  };
};
