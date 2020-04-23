import { createSlice } from "@reduxjs/toolkit";

export const questionnaireSlice = createSlice({
  name: "questionnaire",
  initialState: {
    index: 0,
    questions: [
      {
        id: "q1",
        q: `Do you want to reduce the amount of time that your team spend planning and designing infrastructure?`,
        ec2: {
          true: -1,
          false: 0,
          rationale: `VM infrastructure typically requires large amounts of up-front planning to configure storage and plan physical infrastructure.`,
        },
        containers: {
          true: 1,
          false: 0,
          rationale: `Containers can reduce the amount of up-front planning, however, the use of complex container orchestration platforms such as Kubernetes can mean that the amount of reduction is reduced overall.`,
        },
        lambda: {
          true: 2,
          false: 0,
          rationale: `Serverless architectures are typically focussed on service interactions, resulting in lower amounts of planning and design efforts.`,
        },
      },
      {
        id: "q2",
        q:
          "Do you want to reduce the amount of time that your team spend patching servers?",
        ec2: {
          true: -1,
          false: 0,
          rationale: `VM infrastructure offers minimal benefits, offering a platform to run operating systems on. Patching and maintenance is carried out with 3rd party desired state configuration tools such as Chef, Puppet, Ansible or Powershell DSC.`,
        },
        containers: {
          true: 1,
          false: 0,
          rationale: `Use of a Serverless container platform such as AWS Fargate can reduce the amount of effort expended on server patching, however, the containers themselves may contain operating system dependencies, and require regular updates.`,
        },
        lambda: {
          true: 3,
          false: 0,
          rationale: `Serverless applications use a fully managed operating system and container platform requiring no user management. The security of the platform is managed by AWS.`,
        },
      },
    ],
  },
  reducers: {
    next: (state) => {
      if(state.index == state.questions.length-1) {
        return;
      }
      state.index += 1;
    },
    previous: (state) => {
      if(state.index == 0) {
        return;
      }
      state.index -= 1;
    },
    answer: (state, payload) => {
      if (!state.answers || state.answers.length != state.questions.length) {
        state.answers = new Array(state.questions.length);
      }
      state.answers[state.index] = payload.payload;
      if(state.index == state.questions.length-1) {
        state.end = true;
        return;
      }
      state.index += 1;
    },
  },
});

export const { next, previous, answer } = questionnaireSlice.actions;

export const selectIndex = state => state.questionnaire.index;
export const selectCount = state => state.questionnaire.questions.length;
export const selectQuestion = state => state.questionnaire.questions[state.questionnaire.index];
export const selectResult = state => {
  const result = {
    ec2: 0,
    containers: 0,
    lambda: 0,
  };
  if(!state.questionnaire.answers) {
    return result;
  }
  for(let i = 0; i < state.questionnaire.answers.length; i ++) {
    const answer = state.questionnaire.answers[i]
    const q = state.questionnaire.questions[i];
    result.ec2 += q.ec2[answer] || 0;
    result.containers += q.containers[answer] || 0;
    result.lambda += q.containers[answer] || 0;
  }
  return result;
};
export const selectEnd = state => state.questionnaire.end || false;

export default questionnaireSlice.reducer;
