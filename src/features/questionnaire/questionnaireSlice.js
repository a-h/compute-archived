import { createSlice } from "@reduxjs/toolkit";

const questions = [
  {
    "id": "q1",
    "q": "Do you want to reduce the amount of time that your team spend planning and designing infrastructure?",
    "ec2": {
      "true": -1,
      "false": 0,
      "rationale": "VM infrastructure typically requires large amounts of up-front planning to configure storage and plan physical infrastructure."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "Containers can reduce the amount of up-front planning, however, the use of complex container orchestration platforms such as Kubernetes can mean that the amount of reduction is reduced overall."
    },
    "lambda": {
      "true": 2,
      "false": 0,
      "rationale": "Serverless architectures are typically focussed on service interactions, resulting in lower amounts of planning and design efforts."
    }
  },
  {
    "id": "q2",
    "q": "Do you want to reduce the amount of time that your team spend patching servers?",
    "ec2": {
      "true": -1,
      "false": 0,
      "rationale": "VM infrastructure offers minimal benefits, offering a platform to run operating systems on. Patching and maintenance is carried out with 3rd party desired state configuration tools such as Chef, Puppet, Ansible or Powershell DSC."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "Use of a Serverless container platform such as AWS Fargate can reduce the amount of effort expended on server patching, however, the containers themselves may contain operating system dependencies, and require regular updates."
    },
    "lambda": {
      "true": 3,
      "false": 0,
      "rationale": "Serverless applications use a fully managed operating system and container platform requiring no user management. The security of the platform is managed by AWS."
    }
  },
  {
    "id": "q3",
    "q": "Do you want to reduce the amount of time that your team spend hardening operating systems?",
    "ec2": {
      "true": -2,
      "false": 0,
      "rationale": "VM Infrastructure provides no benefits that can reduce this effort."
    },
    "containers": {
      "true": -1,
      "false": 0,
      "rationale": "While benefits are gained by using the pre-configured Amazon ECS Virtual Machine image, and by benefitting from the sandbox model, typical Docker containers contain many operating system dependencies, sometimes based on a large Linux operating system that may contain many vulnerabilities. The use of a Docker image registry with built in vulnerability scanning can reduce the effort involved with hardening images."
    },
    "lambda": {
      "true": 3,
      "false": 0,
      "rationale": "Serverless applications use a fully managed operating system and container platform requiring no user management. The security of the platform is managed by AWS."
    }
  },
  {
    "id": "q4",
    "q": "Do you want to reduce the effort spent configuring autoscaling?",
    "ec2": {
      "true": -2,
      "false": 0,
      "rationale": "VM Infrastructure may provide integration with autoscaling features such as AWS Elastic Load balancers, but requires appropriate tuning of system parameters which may not be known in advance."
    },
    "containers": {
      "true": -1,
      "false": 0,
      "rationale": "While Containers can simplify scaling and reduce the time taken from a scale out request to a service being scaled, a decision tree of when to scale out and in must be made. This configuration is error prone and can be subject to a number of variables. Mistakes can result in outages."
    },
    "lambda": {
      "true": 3,
      "false": 0,
      "rationale": "Serverless applications autoscale automatically, based on the number of concurrent requests, up to the maximum account concurrency, or a configured maximum."
    }
  },
  {
    "id": "q5",
    "q": "Do you want to minimise the cost of non-production envrionments?",
    "ec2": {
      "true": -1,
      "false": 0,
      "rationale": "VM Infrastructure is relatively fixed. It may be that although some virtual machines are disabled overnight, NAT gateways, Load Balancers or other cloud resources still cost money."
    },
    "containers": {
      "true": 0,
      "false": 0,
      "rationale": "Aside from Serverless container platforms like Fargate, containers generally don't offer additional advantages over VMs here."
    },
    "lambda": {
      "true": 3,
      "false": 0,
      "rationale": "When a Serverless component is not processing, no costs are being incurred. Serverless components are based on a per-request or per-throughput cost model."
    }
  },
  {
    "id": "q6",
    "q": "Does the workload require fault tolerance?",
    "ec2": {
      "true": 0,
      "false": 0,
      "rationale": "VM Infrastructure must be configured to support fault tolerance."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "Container Infrastructure must be configured to support fault tolerance, for example by ensuring that systems run load balacned across AWS availability zones. However, container orchestration tools such can provide automatic failure detection and restart failed containers."
    },
    "lambda": {
      "true": 3,
      "false": 0,
      "rationale": "Fault tolerance is included by default with Serverless components, using automatic retries and dead letter queues."
    }
  },
  {
    "id": "q7",
    "q": "Is the language runtime of the workload Node.js, .NET Core, Java, Python or Go?",
    "ec2": {
      "true": 1,
      "false": 1,
      "rationale": "VM Infrastructure provides a good platform for running applications that have a long initial start-up time such as Java and .NET, but can support any programming language for the machine architecture."
    },
    "containers": {
      "true": 1,
      "false": 1,
      "rationale": "Container Infrastructure provides a good platform for running applications that have a long initial start-up time such as Java and .NET, but can support any programming language for the machine architecture."
    },
    "lambda": {
      "true": 1,
      "false": -5,
      "rationale": "AWS Lambda has a restricted number of supported runtimes, and the design favours language runtimes that offer fast startup times to avoid the \"Cold Start\" issues of .NET and Java."
    }
  },
  {
    "id": "q8",
    "q": "Does the workload require in-memory storage caching of data across requests / operations?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "VM Infrastructure is suited to storing data in memory for extend periods of time. However, this type of design can harm scalability and fault tolerance."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "Container Infrastructure is suited to storing data in memory for extend periods of time. However, this type of design can harm scalability and fault tolerance."
    },
    "lambda": {
      "true": -5,
      "false": 1,
      "rationale": "While AWS Lambda may store data in RAM between requests, it is not guaranteed behaviour. Lambda is suited to stateless workloads - where application state is externalised to a database."
    }
  },
  {
    "id": "q9",
    "q": "Can in-memory state be moved to an external database or cache without excessive performance degredation?",
    "ec2": {
      "true": 0,
      "false": -2,
      "rationale": "Relying on the uptime of a program can harm the scalability and fault tolerance of a service. Consider externalising state to a horizontally scalable database."
    },
    "containers": {
      "true": 0,
      "false": -2,
      "rationale": "Relying on the uptime of a program can harm the scalability and fault tolerance of a service. Consider externalising state to a horizontally scalable database."
    },
    "lambda": {
      "true": 1,
      "false": -5,
      "rationale": "While AWS Lambda may store data in RAM between requests, it is not guaranteed behaviour. Lambda is suited to stateless workloads - where application state is externalised to a database."
    }
  },
  {
    "id": "q10",
    "q": "Can the workload be designed to use a non-relational database for transactions?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "Non-relational databases such as DynamoDB can offer highly scalable and predictable performance with lower maintenance and specialist skill requirements."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "Non-relational databases such as DynamoDB can offer highly scalable and predictable performance with lower maintenance and specialist skill requirements."
    },
    "lambda": {
      "true": 1,
      "false": 0,
      "rationale": "Non-relational databases such as DynamoDB can offer highly scalable and predictable performance with lower maintenance and specialist skill requirements."
    }
  },
  {
    "id": "q11",
    "q": "Is the workload unpredictable (periods of low usage and periods of high usage)?",
    "ec2": {
      "true": -2,
      "false": 2,
      "rationale": "VM Infrastructure tends to have a slower scale out and in process than other solutions. If the VM Infrastructure in on-premises, then procurement, physical installation and other elements can prevent the solution from scaling well. However, if the usage is fixed, it can be a cost-effective and simple solution."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "Containers can scale out relatively quickly by increasing the number of containers running an application throughout a shared cluster. However, a container cluster typically has a higher TCO than a Serverless architecture."
    },
    "lambda": {
      "true": 2,
      "false": 0,
      "rationale": "Serverless workloads are well suited to unpredictable usage due to the highly dynamic scaling, and payment models."
    }
  },
  {
    "id": "q12",
    "q": "Are your team able to modify the architecture and code of the workload?",
    "ec2": {
      "true": 0,
      "false": 1,
      "rationale": "VM Infrastructure is suited to running 3rd party workloads, with providers of solutions often specifying approved deployment patterns."
    },
    "containers": {
      "true": 1,
      "false": -1,
      "rationale": "Configuration of systems within containers is often carried out using environment variables, if the configuration is not flexible enough, containers may not be suitable, given that the code cannot be modified."
    },
    "lambda": {
      "true": 1,
      "false": -3,
      "rationale": "Serverless workloads are built to work well on the target cloud platform. This usually involves the engineering team supporting and delivering features (i.e. a DevOps team)."
    }
  },
  {
    "id": "q13",
    "q": "Do you need access to a corporate network?",
    "ec2": {
      "true": 0,
      "false": 0,
      "rationale": ""
    },
    "containers": {
      "true": 0,
      "false": 0,
      "rationale": ""
    },
    "lambda": {
      "true": -1,
      "false": 1,
      "rationale": "While Serverless workloads work well inside a VPC (thus allowing access to networks via VPN or AWS DirectConnect), it negates some of the benefits of not having a network such as reduced configuration. Consider communicating with other systems via AWS services such as SQS."
    }
  },
  {
    "id": "q14",
    "q": "Is the workload a HTTP API or Web application?",
    "ec2": {
      "true": 0,
      "false": 0,
      "rationale": ""
    },
    "containers": {
      "true": 0,
      "false": 0,
      "rationale": ""
    },
    "lambda": {
      "true": 0,
      "false": 0,
      "rationale": "Serverless workloads are well suited to handling HTTP traffic via API Gateway. Consider the use of the HTTP API for the most cost-effective and lowest latency."
    }
  },
  {
    "id": "q15",
    "q": "Is extremely low latency a priority?",
    "ec2": {
      "true": 0,
      "false": 0,
      "rationale": "VM Infrastructure can be variable, in that systems under load may continue to receive traffic. This can result in highly variable latency responses."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "Container Infrastructure can be variable, in that systems under load may continue to receive traffic. This can result in highly variable latency responses. However, the raw performance of EC2 and elastic load balancing is higher than API Gateway and AWS Lambda."
    },
    "lambda": {
      "true": -1,
      "false": 0,
      "rationale": "The latency of Lambda is variable, and the response times of API Gateway can limit the maximum achievable performance of the solution. However, typically, improvements to downstream services, database access, or caching have larger effects than the latency introduced by API Gateway and Lambda services."
    }
  },
  {
    "id": "q16",
    "q": "Does the workload require receipt of UDP traffic?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "VMs can sit behind a variety of load balancers or be exposed directly to the public Internet to receive a variety of network protocols."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "Containers can sit behind a variety of load balancers or be exposed directly to the public Internet to receive a variety of network protocols."
    },
    "lambda": {
      "true": -2,
      "false": 0,
      "rationale": "AWS Lambda cannot receive UDP traffic."
    }
  },
  {
    "id": "q17",
    "q": "Does the workload need to receive raw TCP socket traffic?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "VMs can sit behind a variety of load balancers or be exposed directly to the public Internet to receive a variety of network protocols."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "Containers can sit behind a variety of load balancers or be exposed directly to the public Internet to receive a variety of network protocols."
    },
    "lambda": {
      "true": -2,
      "false": 0,
      "rationale": "AWS Lambda cannot receive raw TCP traffic, it must be triggered by a load balancer or API Gateway."
    }
  },
  {
    "id": "q18",
    "q": "Is the workload based on message processing, and can use SQS or AWS Kinesis?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "Using a Serverless queue system such as SQS or Kinesis can reduce the management costs of running similar systems such as RabbitMQ or Apache Kafka."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "Using a Serverless queue system such as SQS or Kinesis can reduce the management costs of running similar systems such as RabbitMQ or Apache Kafka."
    },
    "lambda": {
      "true": 3,
      "false": 0,
      "rationale": "AWS Lambda has tight integration with AWS SQS and Kinesis, reducing the amount of application code required to integrate with these solutions, and providing simple concurrency control to manage throughput and scaling."
    }
  },
  {
    "id": "q19",
    "q": "Does the workload need to be \"Cloud Agnostic\"?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "Cloud Agnostic\" designs can result in higher total cost of ownership due to being unable to take advantage of cloud features that lower management overheads."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "Generally teams adopt a cloud provider's container orchestration system, build tooling, configuration management, secret management system, database and other platform components. Containers are often considered to be \"Cloud Native\" designs, but can still result in higher total cost of ownership by not fully taking advantage of cloud features that lower management overheads. It is very rare that teams migrate workloads directly between clouds. It can be worth understanding what the driver is and whether it warrants the hidden costs of not fully utilising your chosen cloud provider's capabilities."
    },
    "lambda": {
      "true": -1,
      "false": 2,
      "rationale": "Serverless workloads are designed to make the best use of a specific cloud provider's capabilities in order to minimize TCO."
    }
  },
  {
    "id": "q20",
    "q": "Does the workload require processing that takes more than 15 minutes per operation?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "There are no restrictions on processing time."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "There are no restrictions on processing time."
    },
    "lambda": {
      "true": -1,
      "false": 0,
      "rationale": "AWS Lambda has a hard timeout limit of 15 minutes. However, Serverless workloads can make use of massively parallel processing and horizontal scalability that can make >15 minute processing time unecessary."
    }
  },
  {
    "id": "q21",
    "q": "Does the workload require specialist hardware, such as a GPU or ARM processor?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "It may not be possible to run your chosen hypervisor on the specific processor. There can be performance costs associated with input/output virtualization that can make containers running on bare metal a more attractive option."
    },
    "containers": {
      "true": 2,
      "false": 0,
      "rationale": "Container orchestration platforms can ensure that workloads are executed against hardware that has appropriate capabilities. Containers can provide higher performance utilization of hardware compared to virtualization, due to the lower overhead."
    },
    "lambda": {
      "true": -2,
      "false": 0,
      "rationale": "AWS Lambda currently supports x86 processors and cannot support custom hardware."
    }
  },
  {
    "id": "q22",
    "q": "Does the workload need to use more than 3GB of RAM per operation?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "Virtual machines can be configured to access high quantites of RAM."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "Containers machines can be configured to access high quantites of RAM."
    },
    "lambda": {
      "true": -1,
      "false": 0,
      "rationale": "AWS Lambda has a hard limit of 3GB of RAM per operation, however, this 3GB of RAM can be scaled at a rate of 500 concurrent operations per minute, providing massive flexible capacity at low cost. Serverless workloads should be optimised for horizontal scalability."
    }
  },
  {
    "id": "q23",
    "q": "Does the workload need to handle loads that grows at a rate of more than 500 concurrent requests per minute?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "Pre-warming of virtual machines and load balancers may be required to accomodate this load."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "Pre-warming of virtual machines and load balancers may be required to accomodate this load."
    },
    "lambda": {
      "true": -1,
      "false": 0,
      "rationale": "AWS Lambda is limited to scaling out an additional 500 concurrent operations per minute. To accomodate high volumes of peak incoming data, consider using Kinesis or SQS to ingest data and process it asynchronously, or use exponential backoff on clients to limit the input throughput."
    }
  },
  {
    "id": "q24",
    "q": "Does the workload require the use of Microsoft Windows?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "Microsoft Windows runs well on virtual machines. However, the RAM consumption of Windows and licensing costs may make it less cost effective than Linux."
    },
    "containers": {
      "true": -2,
      "false": 0,
      "rationale": "While supported, Windows Docker containers are less frequently encountered by teams. Linux containers have much more traction within the industry."
    },
    "lambda": {
      "true": -5,
      "false": 0,
      "rationale": "AWS Lambda does not support Windows workloads. Examining whether the workload really requires Windows could reduce the TCO by reducing licensing costs."
    }
  },
  {
    "id": "q25",
    "q": "Does the workload require the use of a proprietary Linux operating system, e.g. Red Hat?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "Microsoft Windows runs well on virtual machines."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "The Docker daemon runs well on many Linux Distributions. However, typically, Docker users prefer a lightweight base distribution. Operating system features such as management tools may not be relevant in this context."
    },
    "lambda": {
      "true": -5,
      "false": 0,
      "rationale": "AWS Lambda provides a fixed underlying operating system that is managed by AWS in order to provide the benefits of a managed service."
    }
  },
  {
    "id": "q26",
    "q": "Does the workload require the use of an operating system other than Microsoft Windows or Linux?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "Virtual machines can support a wide range of esoteric operating systems."
    },
    "containers": {
      "true": -2,
      "false": 0,
      "rationale": "The Docker daemon runs on Linux and Windows. BSD, Solaris and others have similar implementations (e.g. BSD Jails)."
    },
    "lambda": {
      "true": -5,
      "false": 0,
      "rationale": "AWS Lambda supports a fixed Linux distribution only."
    }
  },
  {
    "id": "q27",
    "q": "Does the workload require high performance single threaded CPU performance?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "Virtual machines reduce overall performance in exchange for the ability to run multiple instances on a single machine, however instances can be swapped out for higher performance instances when new CPU categories are introduced."
    },
    "containers": {
      "true": 2,
      "false": 0,
      "rationale": "Docker can provide many of the management benefits, while having a lower performance overhead than virtualisation."
    },
    "lambda": {
      "true": -1,
      "false": 0,
      "rationale": "AWS Lambda CPU capacity scales with memory allocation - providing 3GB of RAM to a Lambda will scale the availability of CPU processing. However, it is unlikely to match the raw power of a powerful instance - it is optimised for horizontal scalability. Using a message queue to distribute work across hundreds of indiviudual Lamdba functions is simple with tool such as AWS Step Functions."
    }
  },
  {
    "id": "q28",
    "q": "Does the workload require high performance disk access, e.g. to a RAID array or SAN?",
    "ec2": {
      "true": 1,
      "false": 0,
      "rationale": "Virtual machines offer high performance disk access. However, the performance can be limited by the hypervisor."
    },
    "containers": {
      "true": 2,
      "false": 0,
      "rationale": "Docker can provide many of the management benefits, while having a lower performance overhead than virtualisation."
    },
    "lambda": {
      "true": -1,
      "false": 0,
      "rationale": "AWS Lambda does not support direct access to block storage devices such as EBS volumes. However, many applications can be re-architected to make use of S3 as a primary data store."
    }
  },
  {
    "id": "q29",
    "q": "Does the workload require precise control of operating system parameters, such as number of open files?",
    "ec2": {
      "true": 2,
      "false": 0,
      "rationale": "Virtual machines offer a high degree of customisation, at the cost of increased management overhead."
    },
    "containers": {
      "true": 1,
      "false": 0,
      "rationale": "The underlying operating system is shared between multiple containers, so while the parameters can be tuned, they may affect all systems running on the host."
    },
    "lambda": {
      "true": -1,
      "false": 0,
      "rationale": "AWS Lambda provides a fixed underlying operating system that is managed by AWS in order to provide the benefits of a managed service. Consider whether the solution really requires precise control, or whether this restriction can be designed out."
    }
  },
  {
    "id": "q30",
    "q": "Does your code require fast access to >50MB of data on disk?",
    "ec2": {
      "true": 2,
      "false": 0,
      "rationale": "It's possible to package large quantities of data along with your program."
    },
    "containers": {
      "true": 4,
      "false": 0,
      "rationale": "It's possible to package large quantities of data along with your program."
    },
    "lambda": {
      "true": -1,
      "false": 0,
      "rationale": "AWS Lambda can package up to 50MB of zipped data and code, however it can download data from S3 on startup. This introduces some costs and latency for the solution, which may not be acceptable in all cases."
    }
  }
];  

export const questionnaireSlice = createSlice({
  name: "questionnaire",
  initialState: {
    index: 0,
    questions,
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
