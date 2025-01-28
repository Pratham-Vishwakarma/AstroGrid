const todos = [
    {
      id: 1,
      title: 'Finish Team Meeting Preparation',
      date: '2025-01-25',
      time: '10:00 AM - 11:00 AM',
      description: 'Prepare agenda and slides for the weekly team meeting.',
      priority: 'High',
      status: 'Incomplete',
      color: 'bg-red-600 bg-opacity-60'
    },
    {
      id: 2,
      title: 'Complete Ok Work Tasks',
      date: '2025-01-25',
      time: '9:30 AM - 12:00 PM',
      description: 'Work on the project tasks with my buddy.',
      priority: 'Medium',
      status: 'Incomplete',
      color: 'bg-yellow-700'
    },
    {
      id: 3,
      title: 'Prepare Client Presentation',
      date: '2025-01-25',
      time: '2:00 PM - 2:45 PM',
      description: 'Final touches for the quarterly client presentation.',
      priority: 'High',
      status: 'Incomplete',
      color: 'bg-red-600 bg-opacity-60'
      
    },
    {
      id: 4,
      title: 'Submit Project Deadline',
      date: '2025-01-25',
      time: '5:00 PM - 5:30 PM',
      description: 'Complete and submit the final project deliverables.',
      priority: 'High',
      status: 'Incomplete',
      color: 'bg-red-600 bg-opacity-60'
    },
    {
      id: 5,
      title: 'Late Night Work Session',
      date: '2025-01-25',
      time: '1:30 AM - 3:30 AM',
      description: 'Work on critical tasks in a focused, quiet environment.',
      priority: 'Low',
      status: 'Incomplete',
      color: 'bg-green-600 bg-opacity-60'
    },
    {
      id: 6,
      title: 'Review Design Feedback',
      date: '2025-01-25',
      time: '12:00 PM - 1:00 PM',
      description: 'Review feedback on UI/UX designs and plan improvements.',
      priority: 'Medium',
      status: 'Incomplete',
      color: 'bg-yellow-600 bg-opacity-60'
    },
    {
      id: 7,
      title: 'Take Lunch Break',
      date: '2025-01-25',
      time: '1:00 PM - 2:00 PM',
      description: 'Take a break to relax and recharge.',
      priority: 'Low',
      status: 'Incomplete',
      color: 'bg-green-600 bg-opacity-60'
    },
    {
      id: 8,
      title: 'Brainstorm with Team',
      date: '2025-01-25',
      time: '3:00 PM - 4:00 PM',
      description: 'Collaborate on new ideas during a brainstorming session.',
      priority: 'Medium',
      status: 'Incomplete',
      color: 'bg-yellow-600 bg-opacity-60'
    },
    {
      id: 9,
      title: 'Morning Yoga Session',
      date: '2025-01-25',
      time: '6:30 AM - 7:30 AM',
      description: 'Stretch and relax during a peaceful yoga session.',
      priority: 'Low',
      status: 'Incomplete',
      color: 'bg-green-600 bg-opacity-60'
    },
    {
      id: 10,
      title: 'Complete Coding Sprint',
      date: '2025-01-25',
      time: '9:00 AM - 12:00 PM',
      description: 'Focus on coding tasks for a development sprint.',
      priority: 'High',
      status: 'Incomplete',
      color: 'bg-red-600 bg-opacity-60'
    },
    {
      id: 11,
      title: 'Dinner with Client',
      date: '2025-01-26',
      time: '7:00 PM - 9:00 PM',
      description: 'Business dinner to discuss project progress.',
      priority: 'Medium',
      status: 'Incomplete',
      color: 'bg-yellow-600 bg-opacity-60'
    },
    {
      id: 12,
      title: 'Attend HR Training',
      date: '2025-01-27',
      time: '10:00 AM - 12:00 PM',
      description: 'Participate in a training session on HR skills and policies.',
      priority: 'Medium',
      status: 'Incomplete',
      color: 'bg-yellow-600 bg-opacity-60'
    },
    {
      id: 13,
      title: 'Marketing Campaign Review',
      date: '2025-01-27',
      time: '1:00 PM - 3:00 PM',
      description: 'Discuss strategy and updates for the marketing campaign.',
      priority: 'High',
      status: 'Incomplete',
      color: 'bg-red-600 bg-opacity-60'
    },
    {
      id: 14,
      title: 'Tech Talk on AI',
      date: '2025-01-27',
      time: '4:00 PM - 5:00 PM',
      description: 'Attend a guest speaker session on artificial intelligence.',
      priority: 'Low',
      status: 'Incomplete',
      color: 'bg-green-600 bg-opacity-60'
    },
    {
      id: 15,
      title: 'Evening Walk',
      date: '2025-01-27',
      time: '6:30 PM - 7:00 PM',
      description: 'Go for a relaxing evening walk to refresh.',
      priority: 'Low',
      status: 'Incomplete',
      color: 'bg-green-600 bg-opacity-60'
    },
    {
      id: 16,
      title: 'Complete Coding Marathon',
      date: '2025-01-27',
      time: '8:00 PM - 11:00 PM',
      description: 'Work on coding tasks for an extended period.',
      priority: 'High',
      status: 'Incomplete',
      color: 'bg-red-600 bg-opacity-60'
    },
    {
      id: 17,
      title: 'Morning Workout',
      date: '2025-01-28',
      time: '6:00 AM - 7:00 AM',
      description: 'Morning fitness routine to stay in shape.',
      priority: 'Low',
      status: 'Incomplete',
      color: 'bg-green-600 bg-opacity-60'
    },
    {
      id: 18,
      title: 'Weekly Planning Session',
      date: '2025-01-28',
      time: '9:00 AM - 10:00 AM',
      description: 'Plan tasks and goals for the upcoming week.',
      priority: 'Medium',
      status: 'Incomplete',
      color: 'bg-yellow-600 bg-opacity-60'
    },
    {
      id: 19,
      title: 'Review Budget',
      date: '2025-01-28',
      time: '11:00 AM - 12:00 PM',
      description: 'Analyze the current budget and expenses.',
      priority: 'Medium',
      status: 'Incomplete',
      color: 'bg-yellow-600 bg-opacity-60'
    },
    {
      id: 20,
      title: 'Customer Feedback Review',
      date: '2025-01-28',
      time: '2:00 PM - 3:00 PM',
      description: 'Review feedback from customers to improve services.',
      priority: 'Medium',
      status: 'Incomplete',
      color: 'bg-yellow-600 bg-opacity-60'
    }
  ];
  
  export default todos;