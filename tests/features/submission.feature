Feature: KRIS E-Submission Workflow

  Scenario: Create and terminate a submission
    Given user is logged in as requester
    When user opens the E-Submission module
    And user creates a new "For Approval" submission
    And user submits the submission
    And user terminates the submission sucessfully

  Scenario: Terminated a newly created submission
    Given user is logged in as requester
    When user opens the E-Submission module
    And user creates a new "For Approval" submission
    And user submits the submission
    And user terminates the submission sucessfully
    And user go to the "Participated > Completed" tab
    Then the terminated submission should appear in the list with status "Terminated"

  Scenario: Approve submission
    Given user is logged in as requester
    When user opens the E-Submission module
    And user creates a new "For Approval" submission
    And user submits the submission

    Given user login as approver
    When approver approves a pending submission
    Then submission status should be "Approved"
    And submission should appear in "Completed"