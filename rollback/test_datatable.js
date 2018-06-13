var g_curr_inline_jtr = 0;

var  g_curr_impression_assessors = g_curr_participants = [{"user_id":1,"img_id":1,"username":"Alan Poon","email":"alantypoon@gmail.com","position":"Computer Officer","location":"The University of Hong Kong, HONG KONG"},{"user_id":2,"img_id":2,"username":"Cecilia Chan","email":"cecilia.chan@cetl.hku.hk","position":"Head of Professional Development","location":"Centre for the Enhancement of Teaching and Learning (CETL), The University of Hong Kong"},{"user_id":3,"img_id":3,"username":"Lillian Luk","email":"lillianluk@cetl.hku.hk","position":"Research Assistant","location":"The University of Hong Kong"},{"user_id":7,"img_id":8,"username":"Emma Liu","email":"emkyliu@gmail.com","position":"Research Assistant II","location":"Centre of the Enhancement for Teaching and Learning (CETL), University of Hong Kong, Hong Kong"},{"user_id":8,"img_id":5,"username":"Lavina Luk","email":"ytluk89@hku.hk","position":"Research Assistant","location":"Centre for the Enhancement of Teaching and Learning, The University of Hong Kong"},{"user_id":9,"img_id":7,"username":"Sehrish Iqbal","email":"sehrish@hku.hk","position":"Research Assistant","location":"The University of Hong Kong, Pok Fu Lam"},{"user_id":11,"img_id":6,"username":"CHOY, Yu Hang (Vincent)","email":"vincentvegetable@gmail.com","position":"Research Assistant II (Full-time)","location":"Centre for the Enhancement of Teaching and Learning, The University of Hong Kong, Pok Fu Lam"},{"user_id":12,"img_id":16,"username":"Jonathan Yeung","email":"jncy@hku.hk","position":"Project Leader","location":"Centre for the Enhancement of Teaching and Learning, University of Hong Kong, Hong Kong"},{"user_id":13,"img_id":13,"username":"Lilia Leung","email":"ccleung@gmail.com","position":"Research Assistant ","location":"CETL, University of Hong Kong "},{"user_id":14,"img_id":11,"username":"Nellie Wong","email":"nelliewong1219@gmail.com","position":"Research Assistant II","location":"HKU"},{"user_id":15,"img_id":12,"username":"Davislo","email":"davislo@hku.hk","position":"Project Assistant","location":"Centre for the Enhancement of Teaching and Learning, The University of Hong Kong, Hong Kong"},{"user_id":16,"img_id":14,"username":"Kevin Lau","email":"kvlau88@gmail.com","position":"Research Assistant","location":"Centre for the Enhancement of Teaching and Learning (CETL), The University of Hong Kong, Pokfulam, Hong Kong"},{"user_id":17,"img_id":17,"username":"Katherine Lee","email":"leekath@hku.hk","position":"Research Assistant","location":"The Centre for the Enhancement of Teaching and Learning, The University of Hong Kong"},{"user_id":18,"img_id":18,"username":"Michelle","email":"wt1227@hku.hk","position":"Doctor of Philosophy (Ph.D.), Education (Teaching and Learning), Year 1","location":"The University of Hong Kong"}];

var  g_saved_activity = {
    "act_id" : 4,
    "img_id" : "4",
    "act_type" : "OCL-X",
    "start" : "2008-08-08 09:00",
    "end" : "2008-08-12 18:00",
    "title" : "Post-earthquake Visit to Sichuan",
    "desc" : "Whether it be internationally or locally, the HKRC is without fail always willing to lend a helping hand and show support no matter what the situation. I can surely tell you that this organization has been making a difference and will continue to make a difference to the world for years to come. Simply being a part of the HKRC stands for leaves me speechless everyday. Red Cross is the ideal service organization for a HKU student; it requires commitment and attendance, while meetings are efficient and very organized. Not only that, but it is possible to find a service activity for so many different interests, both on and off campus. Walking into a meeting, you will find a diverse group of students, but we all have one thing in common: we love to serve, and we are all genuinely nice people!",
    "published" : "0",
    "closed" : "0",
    "coordinator_id" : "1",
    "participants" : [ 
        "1", 
        "7", 
        "8", 
        "11", 
        "16"
    ],
    "impression" : {
        "enabled" : "1",
        "panelists" : {
            "coordinator" : "1",
            "self" : "1",
            "peers" : "10",
            "others" : [ 
                "7", 
                "8", 
                "9"
            ]
        },
        "skills" : {
            "Communication" : {
                "unmarked" : 90,
                "marked" : 10,
                "participants" : [ 
                    {
                        "user_id" : 1,
                        "score" : 4,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 5,
                                "comments" : "Well done!"
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 4,
                                "comments" : "Good."
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 5,
                                "comments" : "Excellent"
                            }
                        ]
                    }, 
                    {
                        "user_id" : 7,
                        "score" : 4.5,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 4.5,
                                "comments" : "Way to go! "
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 4,
                                "comments" : "Good"
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 5,
                                "comments" : "Excellent"
                            }
                        ]
                    }, 
                    {
                        "user_id" : 8,
                        "score" : 4.5,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 5,
                                "comments" : "Super!"
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 4,
                                "comments" : "Good"
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 5,
                                "comments" : "Excellent"
                            }
                        ]
                    }, 
                    {
                        "user_id" : 11,
                        "score" : 4,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 4,
                                "comments" : "You're special! "
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 4,
                                "comments" : "Good"
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 5,
                                "comments" : "Excellent"
                            }
                        ]
                    }, 
                    {
                        "user_id" : 16,
                        "score" : 3.5,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 3,
                                "comments" : "Good!"
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 4,
                                "comments" : "Good"
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 5,
                                "comments" : "Excellent"
                            }
                        ]
                    }
                ]
            },
            "Teamwork" : {
                "unmarked" : 90,
                "marked" : 10,
                "participants" : [ 
                    {
                        "user_id" : 1,
                        "score" : 4,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 5,
                                "comments" : "Well done!"
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 4,
                                "comments" : "Good."
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 5,
                                "comments" : "Excellent"
                            }
                        ]
                    }, 
                    {
                        "user_id" : 7,
                        "score" : 4.5,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 4.5,
                                "comments" : "Way to go! "
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 4,
                                "comments" : "Good"
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 5,
                                "comments" : "Excellent"
                            }
                        ]
                    }, 
                    {
                        "user_id" : 8,
                        "score" : 4.5,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 5,
                                "comments" : "Super!"
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 4,
                                "comments" : "Good"
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 5,
                                "comments" : "Excellent"
                            }
                        ]
                    }, 
                    {
                        "user_id" : 11,
                        "score" : 4,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 4,
                                "comments" : "You're special! "
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 4,
                                "comments" : "Good"
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 5,
                                "comments" : "Excellent"
                            }
                        ]
                    }, 
                    {
                        "user_id" : 16,
                        "score" : 3.5,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 3,
                                "comments" : "Good!"
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 4,
                                "comments" : "Good"
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 5,
                                "comments" : "Excellent"
                            }
                        ]
                    }
                ]
            }
        }
    },
    "assessment" : {
        "enabled" : "1",
        "assessments" : [ 
            {
                "ass_id" : "1",
                "method" : "ref",
                "title" : "Self Reflective",
                "weight" : "30",
                "start" : "2016-10-12 09:00",
                "end" : "2016-12-13 18:00",
                "marked" : 20,
                "unmarked" : 80,
                "skills" : [ 
                    "Communication", 
                    "Critical Thinking", 
                    "Teamwork"
                ],
                "panelists" : {
                    "coordinator" : "0",
                    "self" : "1",
                    "peers" : "3",
                    "others" : [ 
                        "9", 
                        "12", 
                        "15"
                    ]
                },
                "participants" : [ 
                    {
                        "user_id" : 1,
                        "score" : 71,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 71,
                                "comments" : "Well done!"
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 70,
                                "comments" : "Good."
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 69,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 68,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 72,
                                "comments" : "Excellent"
                            }
                        ]
                    }, 
                    {
                        "user_id" : 7,
                        "score" : 80,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 89,
                                "comments" : "Way to go! "
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 88,
                                "comments" : "Good"
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 87,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 86,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 85,
                                "comments" : "Excellent"
                            }
                        ]
                    }, 
                    {
                        "user_id" : 8,
                        "score" : 90,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 95,
                                "comments" : "Super!"
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 90,
                                "comments" : "Good"
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 92,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 89,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 85,
                                "comments" : "Excellent"
                            }
                        ]
                    }, 
                    {
                        "user_id" : 11,
                        "score" : 84,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 4,
                                "comments" : "You're special! "
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 84,
                                "comments" : "Good"
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 84.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 84.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 85,
                                "comments" : "Excellent"
                            }
                        ]
                    }, 
                    {
                        "user_id" : 16,
                        "score" : 89,
                        "assessors" : [ 
                            {
                                "user_id" : 1,
                                "date" : "2016-11-16 10:00",
                                "score" : 3,
                                "comments" : "Good!"
                            }, 
                            {
                                "user_id" : 2,
                                "date" : "2016-11-16 09:00",
                                "score" : 4,
                                "comments" : "Good"
                            }, 
                            {
                                "user_id" : 3,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 8,
                                "date" : "2016-11-16 09:00",
                                "score" : 4.5,
                                "comments" : "Very good"
                            }, 
                            {
                                "user_id" : 15,
                                "date" : "2016-11-16 09:00",
                                "score" : 5,
                                "comments" : "Excellent"
                            }
                        ]
                    }
                ],
                "items" : [ 
                    {
                        "question" : "<b>Experience:</b>&nbsp;What have you done and contribute? Briefly describe the activity that you want to reflect upon. Consider what happened and what part your played in it.",
                        "min" : "300",
                        "max" : "500",
                        "weight" : "33"
                    }, 
                    {
                        "question" : "What went well?",
                        "min" : "500",
                        "max" : "1000",
                        "weight" : "33"
                    }, 
                    {
                        "question" : "<b>Learning:</b> What have you learnt?",
                        "min" : "500",
                        "max" : "1000",
                        "weight" : "34"
                    }
                ]
            }, 
            {
                "ass_id" : "2",
                "method" : "mcq",
                "title" : "Earthquake MCQ",
                "weight" : "37",
                "start" : "2016-10-12 09:00",
                "end" : "2016-12-13 18:00",
                "marked" : 30,
                "unmarked" : 70,
                "skills" : [ 
                    "Communication", 
                    "Critical Thinking", 
                    "Teamwork"
                ],
                "panelists" : {
                    "coordinator" : "0",
                    "self" : "1",
                    "peers" : "1",
                    "others" : [ 
                        "1", 
                        "2", 
                        "3"
                    ]
                },
                "items" : [ 
                    {
                        "question" : "Which of the following describes <b>the build up and release of stress</b> during an earthquake?",
                        "choices" : [ 
                            "the Modified Mercalli Scale", 
                            "the elastic rebound theory", 
                            "the principle of superposition", 
                            "the travel time difference", 
                            ""
                        ],
                        "correct" : "B",
                        "weight" : "50"
                    }, 
                    {
                        "question" : "The amount of <b>ground displacement</b> in a earthquake is called the _______",
                        "choices" : [ 
                            "epicenter", 
                            "dip", 
                            "slip", 
                            "focus", 
                            ""
                        ],
                        "correct" : "C",
                        "weight" : "50"
                    }
                ]
            }, 
            {
                "ass_id" : "3",
                "method" : "prt",
                "title" : "Participation Observation",
                "weight" : "33",
                "start" : "2016-10-12 09:00",
                "end" : "2016-12-13 18:00",
                "marked" : 40,
                "unmarked" : 60,
                "skills" : [ 
                    "Communication", 
                    "Critical Thinking", 
                    "Teamwork"
                ],
                "panelists" : {
                    "coordinator" : "0",
                    "self" : "1",
                    "peers" : "1",
                    "others" : [ 
                        "1", 
                        "2", 
                        "3"
                    ]
                },
                "items" : [ 
                    {
                        "item" : "Diagnose",
                        "descs" : [ 
                            "The diagnose is excellent.", 
                            "The diagnose is average.", 
                            "The diagnose is unacceptable."
                        ],
                        "weight" : "50"
                    }, 
                    {
                        "item" : "Leadership",
                        "descs" : [ 
                            "The leadership is excellent.", 
                            "The leadership is average.", 
                            "The leadership is unacceptable."
                        ],
                        "weight" : "50"
                    }
                ],
                "likert" : "3"
            }
        ]
    },
    "media" : [ 
        "9", 
        "10"
    ]
};

var uact = {
	"act_id" : 4,
	"title" : "Post-earthquake Visit to Sichuan",
	"act_type" : "OCL-X",
	"img_id" : "4",
	"desc" : "Whether it be internationally or locally, the HKRC is without fail always willing to lend a helping hand and show support no matter what the situation. I can surely tell you that this organization has been making a difference and will continue to make a difference to the world for years to come. Simply being a part of the HKRC stands for leaves me speechless everyday. Red Cross is the ideal service organization for a HKU student; it requires commitment and attendance, while meetings are efficient and very organized. Not only that, but it is possible to find a service activity for so many different interests, both on and off campus. Walking into a meeting, you will find a diverse group of students, but we all have one thing in common: we love to serve, and we are all genuinely nice people!",
	"media" : [ 
			"252", 
			"253"
	],
	"start" : "2008-08-08 09:00",
	"end" : "2008-08-12 18:00",
	"published" : 0,
	"coordinator" : 1,
	"uact_role" : "coordinator",
	"uact_coordinator" : 1,
	"uact_assessor" : 1,
	"uact_participant" : 1,
	"sharing" : "0",
	"impression" : {
			"panelists" : {
					"coordinator" : "1",
					"self" : "1",
					"peers" : "10",
					"others" : [ 
							"7", 
							"8", 
							"9"
					],
					"peer_assessors" : [ 
							2, 
							3, 
							8, 
							15
					]
			},
			"skills" : {
					"Communication" : {
							"show" : 1,
							"score" : 4.8,
							"assessors" : [ 
									{
											"user_id" : 2,
											"date" : "2016-11-15 09:00",
											"score" : 4.5,
											"comments" : "His enthusiasm and passion are exemplary."
									}, 
									{
											"user_id" : 3,
											"date" : "2016-11-14 09:00",
											"score" : 5,
											"comments" : "I’m so thankful for you in this project, we couldn’t have done it without you!"
									}, 
									{
											"user_id" : 8,
											"date" : "2016-11-13 09:00",
											"score" : 4.7,
											"comments" : "He did a great job organizing the data in this report. Well organized data is what really makes a difference during the monthly review. Keep up the good work."
									}, 
									{
											"user_id" : 15,
											"date" : "2016-11-12 09:00",
											"score" : 5,
											"comments" : "His extra effort and dedication have made this project a success."
									}
							]
					},
					"Teamwork" : {
							"show" : 1,
							"score" : 4.2,
							"assessors" : [ 
									{
											"user_id" : 2,
											"date" : "2016-11-15 09:00",
											"score" : 4.5,
											"comments" : "His enthusiasm and passion are exemplary."
									}, 
									{
											"user_id" : 3,
											"date" : "2016-11-14 09:00",
											"score" : 5,
											"comments" : "I’m so thankful for you in this project, we couldn’t have done it without you!"
									}, 
									{
											"user_id" : 8,
											"date" : "2016-11-13 09:00",
											"score" : 4.7,
											"comments" : "He did a great job organizing the data in this report.  Well organized data is what really makes a difference during the monthly review. Keep up the good work."
									}, 
									{
											"user_id" : 15,
											"date" : "2016-11-12 09:00",
											"score" : 5,
											"comments" : "His extra effort and dedication have made this project a success."
									}
							]
					}
			}
	},
	"assessments" : [ 
			{
					"ass_id" : 1,
					"method" : "mcq",
					"title" : "MCQ Experiential Learning",
					"weight" : "30",
					"start" : "2016-10-01 09:00",
					"end" : "2016-11-30 18:00",
					"uass_coordinator" : 1,
					"uass_assessor" : 1,
					"uass_participant" : 1,
					"participants" : [ 
							{
									"user_id" : 1,
									"username" : "Alan Poon",
									"img_id" : 1,
									"performed" : "2016-11-10 09:00",
									"marked" : "2016-11-12 10:00"
							}, 
							{
									"user_id" : 3,
									"username" : "Lillian Luk",
									"img_id" : 3,
									"performed" : "2016-11-11 10:00",
									"marked" : ""
							}, 
							{
									"user_id" : 8,
									"username" : "Lavina Luk",
									"img_id" : 5,
									"performed" : "",
									"marked" : ""
							}
					],
					"panelists" : {
							"coordinator" : "1",
							"self" : "1",
							"peers" : "10",
							"others" : [ 
									"7", 
									"8", 
									"9"
							],
							"peer_assessors" : [ 
									2, 
									3, 
									8, 
									15
							]
					},
					"items" : [ 
							{
									"ass_item_id" : 1,
									"performed" : "This is a testing 1",
									"submitted" : "2016-11-10 09:00",
									"av_marks" : 80,
									"assessors" : [ 
											{
													"user_id" : 4,
													"img_id" : 3,
													"username" : "Lillian Luk",
													"marks" : 70,
													"comments" : "You're on the right track now! You've got it made. Super! That's right! That's good. You're really working hard today. You are very good at that. That's coming along nicely. Good work! I'm happy to see you working like that. That's much, much better! Exactly right. I'm proud of the way you worked today. You're doing that much better today. You've just about got it. That's the best you've ever done. You're doing a good job. That's it! Now you've figured it out. That's quite an improvement.",
													"marked" : "2016-11-10 10:00"
											}, 
											{
													"user_id" : 8,
													"img_id" : 5,
													"username" : "Lavina Luk",
													"marks" : 80,
													"comments" : "That's coming along nicely. Good work! I'm happy to see you working like that. That's much, much better! Exactly right. I'm proud of the way you worked today. You're doing that much better today. You've just about got it. That's the best you've ever done. You're doing a good job. That's it! Now you've figured it out. That's quite an improvement.You're on the right track now! You've got it made. Super! That's right! That's good. You're really working hard today. You are very good at that. ",
													"marked" : "2016-11-10 11:00"
											}, 
											{
													"user_id" : 1,
													"img_id" : 1,
													"username" : "Alan Poon",
													"marks" : 90,
													"comments" : "Super! That's right! That's good. You're really working hard today. You are very good at that.  That's coming along nicely. Good work! I'm happy to see you working like that. That's much, much better! Exactly right. You're on the right track now! You've got it made.I'm proud of the way you worked today. You're doing that much better today. You've just about got it. That's the best you've ever done. You're doing a good job. That's it! Now you've figured it out. That's quite an improvement.",
													"marked" : "2016-11-10 12:00"
											}
									]
							}, 
							{
									"ass_item_id" : 2,
									"performed" : "This is a testing 2",
									"submitted" : "2016-11-10 09:00",
									"av_marks" : 80,
									"assessors" : [ 
											{
													"user_id" : 4,
													"img_id" : 3,
													"username" : "Lillian Luk",
													"marks" : 70,
													"comments" : "You're on the right track now! You've got it made. Super! That's right! That's good. You're really working hard today. You are very good at that. That's coming along nicely. Good work! I'm happy to see you working like that. That's much, much better! Exactly right. I'm proud of the way you worked today. You're doing that much better today. You've just about got it. That's the best you've ever done. You're doing a good job. That's it! Now you've figured it out. That's quite an improvement.",
													"marked" : "2016-11-10 10:00"
											}, 
											{
													"user_id" : 8,
													"img_id" : 5,
													"username" : "Lavina Luk",
													"marks" : 80,
													"comments" : "That's coming along nicely. Good work! I'm happy to see you working like that. That's much, much better! Exactly right. I'm proud of the way you worked today. You're doing that much better today. You've just about got it. That's the best you've ever done. You're doing a good job. That's it! Now you've figured it out. That's quite an improvement.You're on the right track now! You've got it made. Super! That's right! That's good. You're really working hard today. You are very good at that. ",
													"marked" : "2016-11-10 11:00"
											}, 
											{
													"user_id" : 11,
													"img_id" : 6,
													"username" : "Vincent Choy",
													"marks" : 90,
													"comments" : "Super! That's right! That's good. You're really working hard today. You are very good at that.  That's coming along nicely. Good work! I'm happy to see you working like that. That's much, much better! Exactly right. You're on the right track now! You've got it made.I'm proud of the way you worked today. You're doing that much better today. You've just about got it. That's the best you've ever done. You're doing a good job. That's it! Now you've figured it out. That's quite an improvement.",
													"marked" : "2016-11-10 12:00"
											}
									]
							}, 
							{
									"ass_item_id" : 3,
									"performed" : "This is a testing 3",
									"submitted" : "2016-11-10 09:00",
									"av_marks" : 80,
									"assessors" : [ 
											{
													"user_id" : 4,
													"img_id" : 3,
													"username" : "Lillian Luk",
													"marks" : 70,
													"comments" : "You're on the right track now! You've got it made. Super! That's right! That's good. You're really working hard today. You are very good at that. That's coming along nicely. Good work! I'm happy to see you working like that. That's much, much better! Exactly right. I'm proud of the way you worked today. You're doing that much better today. You've just about got it. That's the best you've ever done. You're doing a good job. That's it! Now you've figured it out. That's quite an improvement.",
													"marked" : "2016-11-10 10:00"
											}, 
											{
													"user_id" : 8,
													"img_id" : 5,
													"username" : "Lavina Luk",
													"marks" : 80,
													"comments" : "That's coming along nicely. Good work! I'm happy to see you working like that. That's much, much better! Exactly right. I'm proud of the way you worked today. You're doing that much better today. You've just about got it. That's the best you've ever done. You're doing a good job. That's it! Now you've figured it out. That's quite an improvement.You're on the right track now! You've got it made. Super! That's right! That's good. You're really working hard today. You are very good at that. ",
													"marked" : "2016-11-10 11:00"
											}, 
											{
													"user_id" : 11,
													"img_id" : 6,
													"username" : "Vincent Choy",
													"marks" : 90,
													"comments" : "Super! That's right! That's good. You're really working hard today. You are very good at that.  That's coming along nicely. Good work! I'm happy to see you working like that. That's much, much better! Exactly right. You're on the right track now! You've got it made.I'm proud of the way you worked today. You're doing that much better today. You've just about got it. That's the best you've ever done. You're doing a good job. That's it! Now you've figured it out. That's quite an improvement.",
													"marked" : "2016-11-10 12:00"
											}
									]
							}
					]
			}
		]
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActAsst_all(activity, uact){

	if (!activity.assessment || activity.assessment.enabled == '0'){

		$('#tr_actpage_assessment').hide();
	
	} else {

		$('#tr_actpage_assessment').show();
		
		// am i the coordinator?
		var jtr = $('#tr_actpage_assessment_coordinator');
		if (uact.uact_coordinator == 1){
			jtr.show();
			viewActAsst_coor1(jtr.find('.my_datatable'), activity.assessment.assessments);
		} else {
			jtr.hide();
		}
		
	}
}
		
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Coordinator's Table
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActAsst_coor1(jtbl, assessments){

	console.info('viewActAsst_coor1', jtbl, assessments);
/*	
	if (!jtbl.hasClass('dataTable')){
		jtbl.DataTable({
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language: {
				emptyTable: '',
				zeroRecords: '',
			},
			columnDefs: [
				{	targets: [ 0 ],	orderable: false, width:50},
				{	targets: [ 1 ],	orderable: false, width: 600},
				{ targets: [ 2,3,4 ], width: 100, className: 'dt-center'},
				{ targets: [ 5 ],	orderable: false, width: 1, className: 'dt-center'},
			],
		});
	}
*/
	var dt = jtbl.show().DataTable().clear().draw();

	for (var index in assessments){
		var
			assessment = assessments[index],
			ass_id = assessment.ass_id,
			title = assessment.title,
			method = assessment.method,
			name = title // + ' (' +  method_arr[method] + ')'
		;
			dt.row.add([
			ass_id,
//			name,
			'<button type="button" class="btn btn-sm btn-list-edit" onclick=\'viewActAsst_coor2_ios(getIdFromRow(this), this)\' data-toggle="tooltip" title="View">'
				+ '<i class="glyphicon glyphicon-eye-open"></i>'
			+ '</button>',
			assessment.unmarked,
			assessment.marked,
			//getMarkedPercent(assessment.unmarked, assessment.marked),
			100,			
			'<button type="button" class="btn btn-sm btn-list-edit" onclick=\'viewActAsst_coor2(getIdFromRow(this), this)\' data-toggle="tooltip" title="View">'
				+ '<i class="glyphicon glyphicon-eye-open"></i>'
			+ '</button>',

		]);
	}
	dt.draw();
	//setTimeout(function(){
		//dt.fnDraw();
		//dt.draw();
		//dt.refresh();
	//	alert(1);
	//}, 1000);
	
}

////////////////////////////////////////////////////////////////////

function viewActAsst_coor2(ass_id, obj){

	console.info('viewActAsst_coor2', ass_id);
	
	if (g_curr_inline_jtr){
		var
			 ass_id2 = g_curr_inline_jtr.attr('ass_id'),
			 dt_type = g_curr_inline_jtr.closest('table').attr('dt_type')
		;
		if (ass_id2 == ass_id && dt_type == 'assessment_coor1'){
			slideUpParticipantList();
			return;
		} else {
			removeParticipantList();
		}
	}
		
	
	// FIND ASSESSEES UNDER THIS IMPRESSION SKILLS
	var
		act_id = g_saved_activity.act_id,
		assessment = getAssessmentByAssID(g_saved_activity, ass_id)
		participants_ass = assessment.participants
	;
	//console.info(assessment); return;
	var jobj = $(obj);
	//console.info(jobj);
	var jtr = $(obj).closest('tr');
	if (jtr.hasClass('child')){
		jtr = jtr.prev();
	}	

	//console.info(jtr);
	var s = '<table id="example888" class="my_datatable display responsive nowrap" dt_type="assessment_coor2" style="padding-left:20px; width:100%">'
					+ '<thead>'
						+ '<tr>'
							+ '<th>User ID</th>'
							+ '<th>Particpants</th>'
							+ '<th>Average Marks</th>'
							+ '<th>Assessors</th>'
						+ '</tr>'
					+ '</thead>'
				+ '</table>'
	;
	jtr.after('<tr ass_id="' + ass_id + '"><td colspan="7"><div style="display:none">' + s + '</div></td></tr>');
	var jtr2 = jtr.next();
	var jtbl = jtr2.find('.my_datatable');
	jtbl.DataTable({
		//ordering: false,	// otherwise, the list is difficult to trace
		rowReorder: true,
		autoWidth: false,
		bPaginate: false,
		dom: '',
		language:{
			emptyTable: '',
			zeroRecords: '',
		},
		columnDefs: [
//			{	targets: [ 0 ],	orderable: false,	visible: false, },
//			{	targets: [ 2 ],	width:100, className: 'dt-center'},
//			{	targets: [ 3 ],	width:1, orderable: false},
			
			{ responsivePriority: 1, targets: 0 },
      { responsivePriority: 1, targets: 1 },
      { responsivePriority: 1, targets: -1 }			
		],
		responsive: true,
	});
	
	var dt = jtbl.show().DataTable().clear().draw();
	if (participants_ass){
		for (var i = 0; i < participants_ass.length; i++){
			var
				participant_ass = participants_ass[i],
				// GET FROM UACT
				participant_id = participant_ass.user_id,
				// GET FROM SAVED 
				participant_user = getUserByID(g_curr_participants, participant_id)
			;
			if (!participant_user){

				console.error('error user', participant_id);

			} else {
				var date = participant_ass.date ? getDateWithoutTime(participant_ass.date) : '',
					img_id = participant_user.img_id,
					username = participant_user.username,
					score = participant_ass.score,
					nRated = 3,
					list = createAssessorsList(participant_ass.assessors, nRated)
				;
				//console.info(assessors);
				var arr = [
						participant_id,
						'<!--' + username + '--><img class="person_photo" src="' + getUserImgSrc(img_id) + '"/> ' + username,
						score,
						list
				];
				//console.info(arr);
				dt.row.add(arr);
			}
		}
		dt.draw();

		// UPDATE PHOTO
		jtbl.find('.person_photo').each(function(){
			var img_id = $(this).attr('img_id');
			if (img_id){
				updateImgPhoto($(this), img_id, 'user');
			}
		});			

		jtbl.find('.tbl_assessors').click(function(){
			viewActAsst_coor3(ass_id, $(this));	// this => user_id
		});
	}

	// SHOW THE TBL
	var jdiv = jtbl.parent();
	jdiv.slideDown();

	// REMEMBER THE ROW
	g_curr_inline_jtr = jtr2;
	
	// ADD BUTTONS PANEL
	jtr2.after('<tr class="tr_buttons_panel"><td colspan="7"><div class="buttons_panel">'
		+ '<button class="btn_close btn btn-primary"><i class="glyphicon glyphicon-ok-circle"></i> Close</button> '
		+ '<div></td></tr>');
		
	// HIDE THE TABLE
	var jtr3 = jtr2.next();
	jtr3.find('.btn_close').click(function(){
		slideUpParticipantList();
	});

	//jtbl.find('[data-toggle="tooltip"]').tooltip(); 	// render bootstrap tooltip
	
	

}

function viewActAsst_coor2_ios(ass_id, obj){

	console.info('viewActAsst_coor2_ios', ass_id);
	
	if (g_curr_inline_jtr){
		var
			 ass_id2 = g_curr_inline_jtr.attr('ass_id'),
			 dt_type = g_curr_inline_jtr.closest('table').attr('dt_type')
		;
		if (ass_id2 == ass_id && dt_type == 'assessment_coor1'){
			slideUpParticipantList();
			return;
		} else {
			removeParticipantList();
		}
	}
		
	
	// FIND ASSESSEES UNDER THIS IMPRESSION SKILLS
	var
		act_id = g_saved_activity.act_id,
		assessment = getAssessmentByAssID(g_saved_activity, ass_id)
		participants_ass = assessment.participants
	;
	//console.info(assessment); return;
	//var jtr = $(obj).parent().parent();
	var jtr = $(obj).closest('tr');
	if (jtr.hasClass('child')){
		jtr = jtr.prev();
	}		
	//console.info(jtr);
	var s = '<table id="example" ass_id="' + ass_id + '" class="my_datatable display responsive nowrap" dt_type="assessment_coor2" style="padding-left:20px; width:100%">'
					+ '<thead>'
						+ '<tr>'
							+ '<th>User ID</th>'
							+ '<th>Particpants</th>'
							+ '<th>Average Marks</th>'
							+ '<th></th>'
						+ '</tr>'
					+ '</thead>'
				+ '</table>'
	;
	//jtr.after('<tr ass_id="' + ass_id + '"><td colspan="7"><div style="display:none">' + s + '</div></td></tr>');
	var jdiv = $('#div_hidden');
	jdiv.html(s);
	
	//var jtr2 = jtr.next();
	var jtbl = jdiv.find('.my_datatable');
	jtbl.DataTable({
		//ordering: false,	// otherwise, the list is difficult to trace
		rowReorder: true,
		autoWidth: false,
		bPaginate: false,
		dom: '',
		language:{
			emptyTable: '',
			zeroRecords: '',
		},
		columnDefs: [
//			{	targets: [ 0 ],	orderable: false,	visible: false, },
//			{	targets: [ 2 ],	width:100, className: 'dt-center'},
//			{	targets: [ 3 ],	width:1, orderable: false},
			
			{ responsivePriority: 1, targets: 0 },
      { responsivePriority: 1, targets: 1 },
      { responsivePriority: 1, targets: -1 }			
		],
		responsive: true,
	});
	
	var dt = jtbl.show().DataTable().clear().draw();
	if (participants_ass){
		for (var i = 0; i < participants_ass.length; i++){
			var
				participant_ass = participants_ass[i],
				// GET FROM UACT
				participant_id = participant_ass.user_id,
				// GET FROM SAVED 
				participant_user = getUserByID(g_curr_participants, participant_id)
			;
			if (!participant_user){

				console.error('error user', participant_id);

			} else {
				var date = participant_ass.date ? getDateWithoutTime(participant_ass.date) : '',
					img_id = participant_user.img_id,
					username = participant_user.username,
					score = participant_ass.score,
					nRated = 3,
					//list = createAssessorsList(participant_ass.assessors, nRated)
					button = '<button type="button" class="btn btn-sm btn-list-edit" onclick=\'viewActAsst_coor3($(this))\' data-toggle="tooltip" title="View">'
							+ '<i class="glyphicon glyphicon-eye-open"></i>'
						+ '</button>'					
					
				;
				//console.info(assessors);
				var arr = [
						participant_id,
						'<!--' + username + '--><img class="person_photo" src="' + getUserImgSrc(img_id) + '"/> ' + username,
						score,
						//list
						button
				];
				
				//console.info(arr);
				dt.row.add(arr);
			}
		}
		dt.draw();

		// UPDATE PHOTO
		jtbl.find('.person_photo').each(function(){
			var img_id = $(this).attr('img_id');
			if (img_id){
				updateImgPhoto($(this), img_id, 'user');
			}
		});			

		jtbl.find('.tbl_assessors').click(function(){
			//viewActAsst_coor3(ass_id, $(this));	// this => user_id
			viewActAsst_coor3($(this));	// this => user_id
		});
	}

	// SHOW THE TBL
	//var jdiv = jtbl.parent();
	//jdiv.slideDown();

	// REMEMBER THE ROW
	//g_curr_inline_jtr = jtr2;
	
	// ADD BUTTONS PANEL
	//jtr2.after('<tr class="tr_buttons_panel"><td colspan="7"><div class="buttons_panel">'
	//	+ '<button class="btn_close btn btn-primary"><i class="glyphicon glyphicon-ok-circle"></i> Close</button> '
	//	+ '<div></td></tr>');
		
	// HIDE THE TABLE
	//var jtr3 = jtr2.next();
	//jtr3.find('.btn_close').click(function(){
	//	slideUpParticipantList();
	//});

	//jtbl.find('[data-toggle="tooltip"]').tooltip(); 	// render bootstrap tooltip
	var s = jdiv.html();
	//alert(s);
	console.info(s);
	// pass it to ios
	
	newwin("datatable_level2.php", "setDataTable('"+ass_id+"','"+s+"')");
	
//	window.location = "newwin://datatable_level2.php>setDataTable('"+ass_id+"','"+s+"')";
	
	
}




//////////////////////////////////////////////////////////////////
/*
//alert("33");
		var 
			//skill = getSkillByName(g_saved_activity.assessment.skills, skill_name),
			jtr = jobj.closest('tr'),
			jtbl = jtr.closest('table'),
			dt = jtbl.DataTable()
			row = dt.row(jtr),
			cols = row.data(),
			assessment = getAssessmentByAssID(g_saved_activity, ass_id),
			participant_id = parseInt(cols[0]),
			participant_name = $('<div>' + cols[1] + '</div>').text(),
			participant_ass = getUserByID(assessment.participants, participant_id),
			assessment_name = getAssessmentName(assessment)
		;
		
		if (participant_ass && participant_ass.assessors && participant_ass.assessors.length){
			var assessors = participant_ass.assessors;

			console.info('viewActAsst_coor3', participant_id, participant_ass, assessors);
			
			var jdiv = $('<div/>');
			var s = 
				'<span class="subsection_header">Markings for ' + participant_name + '\'s ' + assessment_name + '</span>'
				+ '<table id="dt_level3" class="my_datatable display responsive nowrap" dt_type="assessment_coor3" style="width:100%">'
						+ '<thead>'
							+ '<tr>'
								+ '<th>Assessors</th>'
								+ '<th>Date</th>'
								+ '<th>Score</th>'
								+ '<th>Comments</th>'
							+ '</tr>'
						+ '</thead><tbody>'
			;

			getUsersFromDB(assessors, function(users){

				// loop thru all the assessors
				for (var i in assessors){
					var
						assessor = assessors[i],
						user = getUserByID(users, assessor.user_id)
					;
					var date = getDateWithoutTime(assessor.date);
					//console.info(assessor);
					s += '<tr>'
							 + '<td onclick="openUserPage(' + user.user_id + ')"><!--' + user.username + '--><img class="person_photo" img_id="' + user.img_id + '"/> ' + user.username + '</td>'
							 + '<td>' + assessor.date + '</td>'
							 + '<td>' + assessor.score + '</td>'
							 + '<td>' + assessor.comments + '</td>'
						 + '</tr>'
					;
				}
				s += '</tbody></table>';
				//console.info(s);
				jdiv.append(s);

				jdiv.find('.my_datatable').DataTable({
					//ordering: false,	// otherwise, the list is difficult to trace
					rowReorder: true,
					autoWidth: false,
					bPaginate: false,
					dom: '',
					language:{
						emptyTable: '',
						zeroRecords: '',
					},
					autoWidth: false,	
					columnDefs: [
						{	targets: [ 0 ],	width:200},
						{	targets: [ 1 ],	width:100},
						{	targets: [ 2 ],	width:100,	className: 'dt-center'},
						{	targets: [ 3 ],	width:300},
					],
				});

				jdiv.find('.person_photo').each(function(){
					updateImgPhoto($(this), $(this).attr('img_id'), 'user');
				});	

				// pass it to ios
				window.location= "level3://"+$('.my_datatable').parent().html();
		//		$("#codearea").html(jdiv.html());
				$.featherlight(jdiv, {});
			})		
		}
*/

function viewActAsst_coor3(jobj){
	var 
		jtr = jobj.closest('tr');
		
	if (jtr.hasClass('child')){
		jtr = jtr.prev();
	}		
	var jtbl = $(jtr.closest('table')),
		jtr2 = jtbl.closest('tr'),
		ass_id = parseInt(jtbl.attr('ass_id')),
		//assessment = getAssessmentByAssID(g_saved_activity, ass_id),
		dt = jtbl.DataTable(),
		row = dt.row(jtr),
		cols = row.data(),
		participant_id = parseInt(cols[0]),
		participant_name = $('<div>' + cols[1] + '</div>').text()
	;
	console.info('viewActAsst_coor3', ass_id);
	
	//viewAssessment(ass_id, 'coordinator', participant_id, participant_name);			
}

/////////////////////////////////////////////////////////////////////////////////////////////

function getIdFromRow(obj){
	var jobj = $(obj),
			jtr = jobj.closest('tr')
	if (jtr.hasClass('child')){
		jtr = jtr.prev();
	}
	var jtbl = jobj.closest('table'),
			jtbl_id = jtbl.attr('id'),
			dt = jtbl.DataTable()
			row = dt.row( jtr ),
			cols = row.data(),
			id = cols[0]
	;
	return isNaN(id) ? id : parseInt(id);
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function getAssessmentByAssID(activity, ass_id){
	return activity.assessment.assessments[parseInt(ass_id) - 1];
}


////////////////////////////////////////////////////////////////////////////////////////

function getUserByID(users, user_id){
	var user = 0;
	for (var index in users){
		var user2 = users[index];
		if (user2.user_id == user_id){
			user = user2;
			break;
		}
	}
	return user;
}

///////////////////////////////////////////////////////////////////////////////

function createAssessorsList(assessors, nRated){
	var s = '<table style="background-color:transparent" class="tbl_assessors">'
			+ '<tr>';
	var bMore = 0;
	for (var i in assessors){
		if (i <= nRated - 1){
			var
				tmp = assessors[i],
				user_id = 0,
				assessor = 0
			;
			if (typeof(tmp) == 'object'){	// already
				assessor = jsonclone(tmp);
				user_id = assessor.user_id;
				if (!assessor.img_id && g_curr_impression_assessors){
					var user = getUserByID(g_curr_impression_assessors, user_id)
					assessor.img_id = user.img_id;
					assessor.username = user.username;
				}
			} else {
				user_id = parseInt(tmp);
				assessor = getUserByID(g_curr_impression_assessors, user_id);
			}
			s	+= '<td><img class="person_photo" img_id="' + assessor.img_id + '"/></td>';
		} else {
			bMore = 1;
			break;
		}
	}
	if (bMore){
		s += '<td><a class="fa fa-chevron-right""></a></td>';
	} else {
		s += '<td style="width:10px">&nbsp;</td>';
	}
	s	+= '</tr></table>';
	return s;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////

function jsonclone(obj){
	return JSON.parse(JSON.stringify(obj))
}


/////////////////////////////////////////////////////////////////////////////////////////////////////

function getUserImgSrc(img_id){
	//console.info('getUserImgSrc', img_id);
	//return img_id ? image_url + img_id + '&d=' + getDateString2() : './images/new_user.png';
	return './images/new_user.png';
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getImgUrl(img_id, type){
	//return img_id ? './svrop.php?type=dl_img&img_id=' + img_id + '&d=' + getDateString2() : './images/new_' + type + '.png';
	return './images/new_' + type + '.png';
}


function updateImgPhoto(jobj, img_id, type){

	var url = getImgUrl(img_id, type);
	jobj
//		.css('visibility', 'hidden')
		.css('visibility', 'visible')
		.unbind()
		.load(function(){
			$(this).css('visibility', 'visible')
		})	
		.attr('img_id', img_id)
		.attr('src', url)
	;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function getAssessmentName(assessment){
	return assessment.title;
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function slideUpParticipantList(){
	if (g_curr_inline_jtr){
		g_curr_inline_jtr.find('div').eq(0).slideUp('', function(){
			removeParticipantList();
		});
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function removeParticipantList(){
	if (g_curr_inline_jtr){
		var jtr = g_curr_inline_jtr.next();
		if (jtr.hasClass('tr_buttons_panel')){
		 jtr.remove();
		}
		g_curr_inline_jtr.remove();
		g_curr_inline_jtr = 0;
	}
}

function getUsersFromDB(assessors, onComplete){
	onComplete(g_curr_participants);
}

/////////////////////////////////////////////////////////////////////////////

function getDateWithoutTime(s){
	if (s && s.length > 10){
		// yyyy-mm-dd hh:mm:ss
		return s.substring(0, 10);
	} else {
		return '';
	}
}
