﻿using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.OPService
{
    public class GetSquadre : IGetSquadre
    {
        private readonly IHttpRequestManager<WorkShift> _service;
        private readonly IConfiguration _config;
        public GetSquadre(IHttpRequestManager<WorkShift> service, 
            IConfiguration config)
        {
            _service = service;
            _config = config;
        }

        public async Task<WorkShift> GetAllByCodiceDistaccamento(string Codice)
        {
            var baseurl = new Uri(_config.GetSection("UrlExternalApi").GetSection("OPService").Value);
            var url = new Uri(baseurl, "api/v1/so-workshift/" + "?id_sede=" + Codice);

            var result = await _service.GetAsync(url);

            return result ?? JsonSerializer.Deserialize<WorkShift>(mock);
        }

        private const string mock = @"{
  'next': [
    {
      'id': '60bf2256dc198c3a1451375e',
      'spotId': '94e1f5b9-a413-44c9-8362-b99dc4efa4ae',
      'code': '1/A',
      'description': 'Prima partenza centrale',
      'shift': 'D',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
          'userId': 'PNDFRZ68P16H501T',
          'role': 'TEAM_LEADER',
          'presences': [
            {
              'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
    'userId': 'PNCDNL71C16H501K',
          'role': 'DRIVER',
          'presences': [
            {
        'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
    'userId': 'PRSFNC81T06F839A',
          'role': 'ATTACHE',
          'presences': [
            {
        'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
    'userId': 'VTRGRG71A29H501P',
          'role': 'ATTACHE',
          'presences': [
            {
        'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
    'userId': 'SCRMNL74S11H501P',
          'role': 'ATTACHE',
          'presences': [
            {
        'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451375f',
      'spotId': '2f1b4585-c7fc-4e1d-9857-74ccf5f7b680',
      'code': 'AS/1',
      'description': 'Supporto prima',
      'shift': 'D',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PNDFRZ68P16H501T',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FSLMCL86M27E791Z',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513760',
      'spotId': 'f525e1dd-db18-4e5f-a4fe-e7f88a07e4cf',
      'code': 'CSOLL/1',
      'description': 'Supporto soll',
      'shift': 'D',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'SNDCLD72E03H501S',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DSTFBA68P20H501P',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513761',
      'spotId': 'a89789f8-79f7-4264-86aa-fa5861ee5ca1',
      'code': 'URG/1',
      'description': 'Squadra Urgente',
      'shift': 'D',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PNDFRZ68P16H501T',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FSLMCL86M27E791Z',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513762',
      'spotId': 'a4d39534-b2f4-4dca-9ac9-cd0c81b57637',
      'code': '1/C',
      'description': 'Partenza C centrale',
      'shift': 'D',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PNCDNL71C16H501K',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MRRDNL71C19A269Y',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DLLNTN84P29H501B',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PZZMRZ64R28H501I',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PGNPLA58E12A132O',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513763',
      'spotId': 'f86977dd-6a6b-441f-a438-0ba80851c3d3',
      'code': 'URG/2',
      'description': 'Urgente 2',
      'shift': 'D',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PNDFRZ68P16H501T',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRSNDR73P15D972O',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513764',
      'spotId': '6790de5b-dabc-4d37-a9c0-0562f4dc910b',
      'code': '01/B-COM',
      'description': '01/B-COM',
      'shift': 'D',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PZZMRZ64R28H501I',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513765',
      'spotId': 'aa46560e-2e69-472b-86ec-a18a7f1cb82c',
      'code': '02/B-VCOM',
      'description': '02/B-VCOM',
      'shift': 'D',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MRRDNL71C19A269Y',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513766',
      'spotId': '603811e6-10ea-488d-8fe5-acacd43a51e0',
      'code': '3/A',
      'description': '3/A',
      'shift': 'D',
      'venueId': 'RM.1010',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'VLNLCN65T09H501P',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LRDMHL81D21H501N',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MLENDR79E05H501N',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FRNMSO88A10G148R',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'STPDRN77D02H501K',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513767',
      'spotId': '68210f09-fedb-4801-9bfb-cc7f3d14a5fa',
      'code': '5/A',
      'description': '5/A',
      'shift': 'D',
      'venueId': 'RM.2013',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PZZDNT72L26H501X',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'ZNGNTN77E11H501P',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BNDSRG61D07G293P',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CNLGRL78P28L182Q',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MSCNZE60D14E812M',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513768',
      'spotId': '283bd7bc-a22a-44de-9ceb-f58d9fd9f3ea',
      'code': 'AB/5',
      'description': 'AB/5',
      'shift': 'D',
      'venueId': 'RM.2013',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'GBBDRA70L04H501Z',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'ZNGNTN77E11H501P',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513769',
      'spotId': '87409ce4-5aa8-496d-9de4-7492120c3ba1',
      'code': '6/A',
      'description': '6/A',
      'shift': 'D',
      'venueId': 'RM.1002',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PCCGNN62B28F127H',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'NSCNDR79H29H501K',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CLNCRN68C17H501V',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BNFFBA73R12H501H',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RGNRDN72H19F611U',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451376a',
      'spotId': '3919f5cf-bee5-4da5-9f2d-f481526e6796',
      'code': 'AS/6',
      'description': 'AS/6',
      'shift': 'D',
      'venueId': 'RM.1002',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PCCGNN62B28F127H',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'NSCNDR79H29H501K',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451376b',
      'spotId': '3fc92ba2-c4d1-44e9-ba02-a3c0521a9f2f',
      'code': 'AB/6',
      'description': 'AB/6',
      'shift': 'D',
      'venueId': 'RM.1002',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'LNZSMN82M29H501P',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CLNCRN68C17H501V',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451376c',
      'spotId': 'ec7ebaca-0183-4d85-9df8-688d57536dd4',
      'code': '7/A',
      'description': '7/A',
      'shift': 'D',
      'venueId': 'RM.1004',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MBRMRC68D17B114E',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GNNSVT65A21E506U',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BCHVLR78R29H501H',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GVNSDR75E28H501O',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'VRRNTN78M30A662S',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451376d',
      'spotId': '2ae92a34-e00e-4e7e-b3e0-dd4e08ffd8af',
      'code': 'CTELI/7',
      'description': 'CTELI/7',
      'shift': 'D',
      'venueId': 'RM.1004',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'VNCSFN70E07H5L1Q',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BCHVLR78R29H501H',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451376e',
      'spotId': 'abd79a50-d1d5-42aa-b96f-9eb90944c0c5',
      'code': 'AB/7',
      'description': 'AB/7',
      'shift': 'D',
      'venueId': 'RM.1004',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DSNMRT77M25H501F',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GVNSDR75E28H501O',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451376f',
      'spotId': '4fba5758-8e41-4eb8-94f8-d47b114c6426',
      'code': '8/A',
      'description': '8/A',
      'shift': 'D',
      'venueId': 'RM.1001',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MDNSMN77S23H501Z',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MRTPTR66R03H288O',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DGLLCU71T30H501F',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PMPMRC87P17H501D',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'ZMPNTN65C10H501V',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513770',
      'spotId': '89bb699d-7cbf-44b0-a0c3-6747abf5e99c',
      'code': '9/A',
      'description': '9A',
      'shift': 'D',
      'venueId': 'RM.1005',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MRBLBR64E12H501N',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PZZMRA77B15H501Z',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'STNNDR78A05H501R',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PZZFBA83H25H501A',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MTRSML80L01H501F',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513771',
      'spotId': 'f7e5cf8c-36c8-412c-90ea-b1e1b74bd0e7',
      'code': '10/A',
      'description': '10/A',
      'shift': 'D',
      'venueId': 'RM.1006',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'NRDMRC68A22C268Z',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FLMPRZ85L05H501V',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RTNMRN76H03H501R',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CFFFNC75L26B354L',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PPPPTR63H22H501Z',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513772',
      'spotId': 'b435d3c2-dac7-469c-aa6b-0003a8ce6398',
      'code': 'AB/10',
      'description': 'AB/10',
      'shift': 'D',
      'venueId': 'RM.1006',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'NRDMRC68A22C268Z',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513773',
      'spotId': 'c54c0b3b-827a-406b-96b1-2d566bf1a00f',
      'code': 'AG/10',
      'description': 'AG/10',
      'shift': 'D',
      'venueId': 'RM.1006',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'FLMPRZ85L05H501V',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RTNMRN76H03H501R',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513774',
      'spotId': '6dc15fd9-5536-428c-aaf1-ebf5e18bd34b',
      'code': '11/A',
      'description': '11/A',
      'shift': 'D',
      'venueId': 'RM.1007',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MDRRCR66R23H501W',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRDCST76T04H501Y',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MNTMRC86P04H501U',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'QGLMRC69M10H501Y',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CTAGRD81P25H501W',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513775',
      'spotId': '5618f4a3-9faa-44da-a99b-024ab830d661',
      'code': 'A/TRID 11',
      'description': 'A/TRID 11',
      'shift': 'D',
      'venueId': 'RM.1007',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MDRRCR66R23H501W',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MNTMRC86P04H501U',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'QGLMRC69M10H501Y',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513776',
      'spotId': '70b6ca8c-c0bb-4b79-b89a-eb1e1180b264',
      'code': '12/A',
      'description': '12/A',
      'shift': 'D',
      'venueId': 'RM.1008',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DPNPTR65A29D773K',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'TSODGI74B14F205T',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRVVCN80B01L719K',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GNESRG76L12H501S',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FGLCRL69L17H501G',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513777',
      'spotId': 'f25b3b25-1aac-47c5-b0e4-141c25124c25',
      'code': 'AS/12',
      'description': 'AS/12',
      'shift': 'D',
      'venueId': 'RM.1008',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'NVLCRL67S21H501S',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PRRLSN83R28H501F',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513778',
      'spotId': '2f49760b-1ab9-4b2b-95db-e6a583ac5b7b',
      'code': 'AB/12',
      'description': 'AB/12',
      'shift': 'D',
      'venueId': 'RM.1008',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'FGLCRL69L17H501G',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LCNSFN82E03D773L',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513779',
      'spotId': '89c95063-4461-429a-a14d-47a87f412c70',
      'code': '14/A',
      'description': '14/A',
      'shift': 'D',
      'venueId': 'RM.2007',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PRTNRC64D10A309J',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PMPGPP64L21L851Y',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RLNNTN73P23I992Y',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SMPRRT76A19I992E',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LRASRI70E26E263R',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451377a',
      'spotId': '4d483346-3541-4aff-b3db-9f3c35e172df',
      'code': '15/A',
      'description': '15/A',
      'shift': 'D',
      'venueId': 'RM.2004',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'VSCMSM67P01H501K',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRCMRA80T12E958F',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRCPPL73P29H501S',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MNCLRT66B16D972R',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RZZMRC83E17E958U',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451377b',
      'spotId': 'e1f60eff-98f7-4c76-ada8-ffd8d7d70ed4',
      'code': '16/A',
      'description': '16/A',
      'shift': 'D',
      'venueId': 'RM.2002',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MGGFRZ65B16C390C',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PRLRCR62S19H501E',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRCMLN73S21D773U',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PRSTNN75D01C858C',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SBLLSN82S06G274Y',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451377c',
      'spotId': 'f73af6fd-88ad-40b5-98e7-c706e7675503',
      'code': '17/A',
      'description': '17/A',
      'shift': 'D',
      'venueId': 'RM.2009',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'QRNGNN64P30C773L',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'VLRLCU72B21H501C',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CPPMHL80R06H224Y',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FNTSMN68S29C773Y',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'STFLSN67R27C773G',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451377d',
      'spotId': '80988401-cb74-404c-b093-ce99fdc4195f',
      'code': 'AS/17',
      'description': 'AS/17',
      'shift': 'D',
      'venueId': 'RM.1008',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PRRLSN83R28H501F',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LCNSFN82E03D773L',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LVELSN77C08H501I',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451377e',
      'spotId': 'af218ed7-40c8-43a9-bde6-67126583a945',
      'code': '18/A',
      'description': '18/A',
      'shift': 'D',
      'venueId': 'RM.2008',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'RTORRT63R29H50MN',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'TRLMNL76E14H501K',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SPRDNC72T26H501A',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'TSTMRN64T07L182X',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DCRRRT67S13H501T',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451377f',
      'spotId': '0610c110-1bc3-44dc-825f-ffaecc420999',
      'code': 'AB/19',
      'description': 'AB/19',
      'shift': 'D',
      'venueId': 'RM.2008',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'TSTMRN64T07L182X',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SPRDNC72T26H501A',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513780',
      'spotId': '8f00d9cd-db3a-4d15-9595-4c3bc3604b9c',
      'code': 'ROSSO 1',
      'description': 'ROSSO 1',
      'shift': 'D',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'LNNSFN82M10H501M',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CLNYRU86T18A323H',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513781',
      'spotId': '25fb017d-7da1-4521-8057-087abef7fd1a',
      'code': '20/A',
      'description': '20/A',
      'shift': 'D',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DCAMRC59R31H501H',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CNTGMR78D30G224B',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RCCCLD70S05H501I',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GRSNLM90A07H501C',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PRRLCU68R12H501R',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513782',
      'spotId': '6c61ab5c-b3f5-4d78-b158-43c53acf083e',
      'code': 'DELTA-ASA',
      'description': 'DELTA-ASA',
      'shift': 'D',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DLLMRC68C29H501L',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PRNDVD83S29D423E',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DBNCRL80R21D773I',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513783',
      'spotId': '46a7f7ab-e36b-4454-8afc-7fae6fc648c1',
      'code': 'DELTA-2/ES',
      'description': 'DELTA-2/ES',
      'shift': 'D',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'FLLCMN70L09A783F',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513784',
      'spotId': '747d51a6-e954-4fb3-a053-ca7881060719',
      'code': 'DELTA-03/ES',
      'description': 'DELTA-03/ES',
      'shift': 'D',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DLLMRC68C29H501L',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PRRLCU68R12H501R',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BRAGNN70L28F052L',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513785',
      'spotId': '4e523398-7ccb-4df2-8b9d-ec0c49e9db6d',
      'code': 'OVEST-01',
      'description': 'OVEST-01',
      'shift': 'D',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DLLMRC68C29H501L',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LNNSFN82M10H501M',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MRNRRT69M07H501W',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513786',
      'spotId': '22193aec-b37d-42c7-9ed1-ec7900e0e786',
      'code': 'OVEST-02',
      'description': 'OVEST-02',
      'shift': 'D',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MNTNDR84P27H501R',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PSQLSN85E03L182X',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FRTRRT57T03H501T',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513787',
      'spotId': 'a18bd808-7984-4552-800b-ae7911c85cc6',
      'code': 'OVEST-03',
      'description': 'OVEST-03',
      'shift': 'D',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'CLNYRU86T18A323H',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LNNSFN82M10H501M',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PSQLSN85E03L182X',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513788',
      'spotId': '98acbbaf-15ee-40b4-b441-0e2b0465f9c1',
      'code': 'EST-01',
      'description': 'EST-01',
      'shift': 'D',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'CNTGMR78D30G224B',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RCCCLD70S05H501I',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MRNRRT69M07H501W',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513789',
      'spotId': 'cea70ddf-8b7e-4eaf-a909-615f24850525',
      'code': 'EST-02',
      'description': 'EST-02',
      'shift': 'D',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DCAMRC59R31H501H',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RCCCLD70S05H501I',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PRRLCU68R12H501R',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451378a',
      'spotId': '735611be-e04f-419e-8e13-a5dca06b4d98',
      'code': 'EST-03',
      'description': 'EST-03',
      'shift': 'D',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DLFRCR84R13H224C',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LCNNDR86R10H501O',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MNTNDR84P27H501R',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451378b',
      'spotId': '7e10376c-b4c7-4e75-a521-b38057576a76',
      'code': 'FCO/CENTRALINO',
      'description': 'FCO/CENTRALINO',
      'shift': 'D',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PRRLCU68R12H501R',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DNNLCU87M26F205E',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRCMRC69H15H501U',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451378c',
      'spotId': 'e5a1b200-e8b0-49d9-b8ca-4ecbe7dfff13',
      'code': '21/A',
      'description': '21/A',
      'shift': 'D',
      'venueId': 'RM.2003',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DGLPLG65S21D773G',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SBRLSN72T05H501T',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MZULSN79D26H501J',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'NCCMRC71M16E958U',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PMPFNC64B13D773C',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451378d',
      'spotId': '775c36ca-9481-4629-a439-e990722cc372',
      'code': '22/A',
      'description': '22/A',
      'shift': 'D',
      'venueId': 'RM.2006',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'RCCMCL77L23H501W',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'NNLDRA80T29H501U',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CMNLSN70H13H501F',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GRDFRZ69L12H501B',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RMNSFN78H02H501V',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451378e',
      'spotId': 'c82aa807-c230-495f-a00c-e0bbd7425965',
      'code': 'AS/22',
      'description': 'AS/22',
      'shift': 'D',
      'venueId': 'RM.2006',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'CSDGDU66H10H501T',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CNTTZN84C14E958S',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451378f',
      'spotId': 'cd45b6ef-9a71-4e14-a942-d36b7becec69',
      'code': 'AB/22',
      'description': 'AB/22',
      'shift': 'D',
      'venueId': 'RM.2006',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'GRDFRZ69L12H501B',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CNTTZN84C14E958S',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513790',
      'spotId': '514fd4f5-d90f-48d0-b979-196fd240fb44',
      'code': '23/A',
      'description': '23/A',
      'shift': 'D',
      'venueId': 'RM.2000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'BVLDRN66C04H501A',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PLNRRT82L18L719R',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'NROFBA62L25F880S',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GMPFNC63H21H501K',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'VNNMRC84H17A323J',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513791',
      'spotId': 'c8c74f90-799a-4d18-abac-aeeacc295deb',
      'code': '24/A',
      'description': '24/A',
      'shift': 'D',
      'venueId': 'RM.2005',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PLLSRG64P09L182N',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GTTFRZ67L09G274E',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FRRMSM71A16H501Z',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LVRGLI67S10H501D',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BRRDMN87L24F839S',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513792',
      'spotId': '2726da48-4bcc-4b42-a4e2-832a1128e37f',
      'code': '25/A',
      'description': '25/A',
      'shift': 'D',
      'venueId': 'RM.2001',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'RCCMRN72T29H501U',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MPCMRZ63B24H501C',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LCRPRZ81P29H501Y',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BLLMNL87E02H501O',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FBBMRC72D29H501B',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513793',
      'spotId': '844e76a9-852d-4d39-ab56-13a7e319e384',
      'code': '26/A',
      'description': '26/A',
      'shift': 'D',
      'venueId': 'RM.2015',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MRBCLD70D09H501F',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MRTPTR73A12H501M',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MSCMRC62E17H501X',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GRCDVD86C13H501H',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SPTLCU73B26H501E',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513794',
      'spotId': '497b6ce0-1a3f-4239-bf35-1a0ec5785236',
      'code': '27/A',
      'description': '27/A',
      'shift': 'D',
      'venueId': 'RM.2011',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'FLCMRZ63C22D003L',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GLTMSM72S18A132F',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CNNPRI60H03F880L',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GLLDVD84R06A132W',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CCCDRA82H28D972O',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513795',
      'spotId': '99ef7375-785d-4f42-abb9-fb7940724d96',
      'code': '31/A',
      'description': '31/A',
      'shift': 'D',
      'venueId': 'RM.2012',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DNTGNN65S08B496C',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'NNCFBA66C15H501Z',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SPRLCN70B28H501S',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BNMMRC84S16H501U',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CNTMLN84H15H501F',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513796',
      'spotId': '8d0d6094-1bd0-49c0-a3d8-f58ff4d45e77',
      'code': 'ROSSO 2',
      'description': 'ROSSO 2',
      'shift': 'D',
      'venueId': 'RM.1502',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'VLPLCN66A24H501C',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SPNGPP64M24H501J',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513797',
      'spotId': '95d60263-b8e9-486a-9092-52b2397419e7',
      'code': 'CPO/AIS-1',
      'description': 'CPO/AIS-1',
      'shift': 'D',
      'venueId': 'RM.1502',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'BNCNDR73P20H501X',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CSTNDR73B17H501C',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRSCLD79M29E958D',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513798',
      'spotId': 'ad2f254d-f515-4200-97b1-c8bf39f7fc48',
      'code': 'CPO/AIS-2',
      'description': 'CPO/AIS-2',
      'shift': 'D',
      'venueId': 'RM.1502',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DBRLGU59P19B656P',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a14513799',
      'spotId': '39b5f97a-52cf-43fa-a326-5727ffba7d79',
      'code': 'CPO/AIS-3',
      'description': 'CPO/AIS-3',
      'shift': 'D',
      'venueId': 'RM.1502',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'BNCNDR73P20H501X',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'NCNMNL64B28G273U',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451379a',
      'spotId': '7f389da8-c158-497e-9625-347eadebab66',
      'code': 'CPO/ASA',
      'description': 'CPO/ASA',
      'shift': 'D',
      'venueId': 'RM.1502',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MRLFBA74S18H501N',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RZZDVD83D14H501B',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451379b',
      'spotId': 'ca224a60-46b5-4bfd-a35d-352f4bb9c74d',
      'code': 'CPO/CENTRALINO',
      'description': 'CPO/CENTRALINO',
      'shift': 'D',
      'venueId': 'RM.1502',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'BNCNDR73P20H501X',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'VLPLCN66A24H501C',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451379c',
      'spotId': '40a50da0-5f2e-4ef4-8573-45f38bea92a6',
      'code': 'CRRC',
      'description': 'CRRC',
      'shift': 'D',
      'venueId': 'RM.1552',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'CSTGRL75R18H501C',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BNNMRC74S06F839V',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FLPRRT69A21H501O',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451379d',
      'spotId': 'bb82b381-28ad-4a46-a7ac-6a306314a2a7',
      'code': 'TA/6',
      'description': 'TA/6',
      'shift': 'D',
      'venueId': 'RM.3100',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'GSTNZE68R07D773N',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CCCFRZ72B28L182K',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451379e',
      'spotId': '3bb26e1a-7c6e-4cd6-bfc4-fe6e62b6e8f9',
      'code': 'SIERRA 1',
      'description': 'SIERRA 1',
      'shift': 'D',
      'venueId': 'RM.1551',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'SLVMRC78C10H501D',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MLTRCR65D20H501C',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DSNPLA59S25H501D',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LEILSN67D14H703D',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a1451379f',
      'spotId': 'cf283333-6007-421e-ab47-ce8e1cd1a1d4',
      'code': 'SIERRA 2',
      'description': 'SIERRA 2',
      'shift': 'D',
      'venueId': 'RM.1551',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DSNPLA59S25H501D',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SLVMRC78C10H501D',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a145137a0',
      'spotId': '4410bc12-c35c-4de2-b347-a2775b26209b',
      'code': 'SIERRA 3',
      'description': 'SIERRA 3',
      'shift': 'D',
      'venueId': 'RM.1551',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'SLVMRC78C10H501D',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a145137a1',
      'spotId': '3f2bd5ed-37e2-4019-996d-79b8b2d574b6',
      'code': 'FLUVIALE',
      'description': 'FLUVIALE',
      'shift': 'D',
      'venueId': 'RM.1009',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'GCNSSH79R01L182C',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BLVNDR85S29H501H',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MZUMLN72L04H501K',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GFFFRZ65S01C566J',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a145137a2',
      'spotId': 'dada1e9d-f33f-4ddd-b853-1ba220b2d3dd',
      'code': 'SAF-01',
      'description': 'SAF-01',
      'shift': 'D',
      'venueId': 'RM.1012',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'RSSLGU72C02H501D',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    },
    {
    'id': '60bf2256dc198c3a145137a3',
      'spotId': '45c8a652-46ff-4eea-8f17-a38967551378',
      'code': 'M07',
      'description': 'M07',
      'shift': 'D',
      'venueId': 'RM.2501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'RMNMHL67S17G273B',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BNNDRA83H14H501J',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RNCPLA76P12H501T',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BRBMSM70M15C773F',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-10T06:00:00Z',
              'to': '2021-06-10T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T18:00:00Z',
      'end': '2021-06-12T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-08T07:55:02.762Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf20f7dc198c3a14513758',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T18:00:00Z',
      'workshiftTo': '2021-06-12T06:00:00Z',
      'workshiftShifts': [
        'D'
      ]
    }
  ],
  'current': [
    {
      'id': '60c321257675e329edbaf870',
      'spotId': 'd017b310-b9a9-4940-8c32-c4fdf4ef1e52',
      'code': 'PRIMA',
      'description': 'PRIMA',
      'shift': 'A',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
          'userId': 'PGNPLA58E12A132O',
          'role': 'TEAM_LEADER',
          'presences': [
            {
              'from': '2021-06-11T06:00:00Z',
              'to': '2021-06-11T18:00:00Z'
            }
          ]
        },
        {
    'userId': 'CRRFNC83L06M082U',
          'role': 'ATTACHE',
          'presences': [
            {
        'from': '2021-06-11T06:00:00Z',
              'to': '2021-06-11T18:00:00Z'
            }
          ]
        },
        {
    'userId': 'MCCCST73S07H501X',
          'role': 'ATTACHE',
          'presences': [
            {
        'from': '2021-06-11T06:00:00Z',
              'to': '2021-06-11T18:00:00Z'
            }
          ]
        },
        {
    'userId': 'DNZDNL82H20H501I',
          'role': 'ATTACHE',
          'presences': [
            {
        'from': '2021-06-11T06:00:00Z',
              'to': '2021-06-11T18:00:00Z'
            }
          ]
        },
        {
    'userId': 'PNDFRZ68P16H501T',
          'role': 'ATTACHE',
          'presences': [
            {
        'from': '2021-06-11T06:00:00Z',
              'to': '2021-06-11T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-11T06:00:00Z',
      'end': '2021-06-11T18:00:00Z',
      'version': 1,
      'createdAt': '2021-06-11T08:39:01.403Z',
      'enabled': true,
      'dne': 'EMERGENZA',
      'workshiftId': '60c320d37675e329edbaf86d',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-11T06:00:00Z',
      'workshiftTo': '2021-06-11T18:00:00Z',
      'workshiftShifts': [
        'C',
        'D',
        'A'
      ]
    }
  ],
  'previous': [
    {
      'id': '60c0d70c7675e329edbaf646',
      'spotId': 'e921b5e3-59aa-4661-876e-b7bd179467b7',
      'code': '1/A',
      'description': 'Prima partenza centrale',
      'shift': 'C',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': [
        'O.21826'
      ],
      'spotMembers': [
        {
          'userId': 'BTTMRZ61S23G811L',
          'role': 'TEAM_LEADER',
          'presences': [
            {
              'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
    'userId': 'PNTPLA58C15H501F',
          'role': 'DRIVER',
          'presences': [
            {
        'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
    'userId': 'LGGGPR71T02H501E',
          'role': 'ATTACHE',
          'presences': [
            {
        'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
    'userId': 'GRGSVT83P28F839G',
          'role': 'ATTACHE',
          'presences': [
            {
        'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
    'userId': 'BRNNTN65C14H501C',
          'role': 'ATTACHE',
          'presences': [
            {
        'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf647',
      'spotId': 'c0e7bf39-a8a7-4a89-8a04-7e62c260da97',
      'code': 'AS/1',
      'description': 'Supporto prima',
      'shift': 'C',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': [
        'O.19609'
      ],
      'spotMembers': [
        {
        'userId': 'MSCMHL77P23H501H',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GRGSVT83P28F839G',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf648',
      'spotId': 'fd35ccbe-0dda-4bd2-b028-62bfbf8bab11',
      'code': 'CSOLL/1',
      'description': 'Supporto soll',
      'shift': 'C',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'GLDSTL62H04H501J',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RSSRRT85R09F839B',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf649',
      'spotId': '202dacad-6151-4711-84fc-1d911b2e4656',
      'code': 'URG/1',
      'description': 'Squadra Urgente',
      'shift': 'C',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'STRRNL63P18H501S',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DMNNGL71A25L719G',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf64a',
      'spotId': '3bba6ed3-885d-44b8-82f3-7bf2b93842f2',
      'code': '1/C',
      'description': 'Partenza C centrale',
      'shift': 'C',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'NTNNDR69P20H501Q',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GRDCLD66B07H501C',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BTTMRZ61S23G811L',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SCRRRT68T21C203P',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DLMSMN79H07H501J',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf64b',
      'spotId': '6448955d-aebc-4796-8055-d45d44e46d9a',
      'code': 'URG/2',
      'description': 'Urgente 2',
      'shift': 'C',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'ZNCGPP80M18D708F',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BRGMSM67R08H501H',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf64c',
      'spotId': 'd5e62502-7ab4-4db7-8423-59dc78498ee4',
      'code': '01/B-COM',
      'description': '01/B-COM',
      'shift': 'C',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'ZNCGPP80M18D708F',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf64d',
      'spotId': '34e4aee3-277a-410b-80b4-e0d2ac846223',
      'code': '02/B-VCOM',
      'description': '02/B-VCOM',
      'shift': 'C',
      'venueId': 'RM.1000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'BRNNTN65C14H501C',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf64e',
      'spotId': '40e6d94d-9dd6-44fe-8dcb-15c9658340d1',
      'code': '3/A',
      'description': '3/A',
      'shift': 'C',
      'venueId': 'RM.1010',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DFLLSN81H26L120Q',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRZLCU83P03H501D',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DGSGFR63S03H819Q',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PTTFBA81T20L182Y',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GTTDVD85E29F952A',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf64f',
      'spotId': '106dd947-99d9-443e-b538-b45fc563285a',
      'code': '5/A',
      'description': '5/A',
      'shift': 'C',
      'venueId': 'RM.2013',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'TNCFRZ76D19H501M',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CCCCMN75R09F839O',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SPSCLD81M13H501K',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CPLPLA86R10H501U',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LGMGPP69L02C286L',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf650',
      'spotId': 'bd51ed05-c7e8-4d8b-9ab1-25ab1bb1aad6',
      'code': 'AB/5',
      'description': 'AB/5',
      'shift': 'C',
      'venueId': 'RM.2013',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'SPSCLD81M13H501K',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RZOMRC69A21H501J',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf651',
      'spotId': 'cf206711-70f4-4fc8-b38c-1355303e5ad4',
      'code': '6/A',
      'description': '6/A',
      'shift': 'C',
      'venueId': 'RM.1002',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'FRRNTN65C16H501J',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PGLSCR78P17L182T',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GTADVD80P26D969L',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRSFNC81T23H501U',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BCCNNL80L23H501Z',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf652',
      'spotId': 'afac18ce-88fb-4038-83dc-b46d6a0f32ee',
      'code': 'AS/6',
      'description': 'AS/6',
      'shift': 'C',
      'venueId': 'RM.1002',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PRTGCR66A11H501B',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LZZMRA85B06H501B',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf653',
      'spotId': '4b130e69-b9e4-4ec3-b9fb-648c6c195247',
      'code': 'AB/6',
      'description': 'AB/6',
      'shift': 'C',
      'venueId': 'RM.1002',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'GRFMRK77L01H501T',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PGLSCR78P17L182T',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf654',
      'spotId': '66132d25-6bd8-4dec-bad0-589d2e2e3d91',
      'code': '7/A',
      'description': '7/A',
      'shift': 'C',
      'venueId': 'RM.1004',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'NRVNGL64B15F595D',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RCCPLA78D18H501C',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CVLFNC79R29H501E',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BSCFBA83P24H501G',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MCCSMN82C23H501Z',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf655',
      'spotId': '680d08cb-9666-4f5d-b192-afe213e2d751',
      'code': 'CTELI/7',
      'description': 'CTELI/7',
      'shift': 'C',
      'venueId': 'RM.1004',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'BSCFBA83P24H501G',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CVLFNC79R29H501E',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf656',
      'spotId': '23c7f57f-0cb2-42f0-8e8a-1265ad08d956',
      'code': 'AB/7',
      'description': 'AB/7',
      'shift': 'C',
      'venueId': 'RM.1004',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'NRVNGL64B15F595D',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BFRMRC89A20H501J',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf657',
      'spotId': '72a27563-643a-48df-931a-0e597ff87d3a',
      'code': '8/A',
      'description': '8/A',
      'shift': 'C',
      'venueId': 'RM.1001',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'GRZSLV68C25B496T',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BNCSMN81C20H501L',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PRGNGL64E05M082L',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SNTGLN76M28H501O',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SCGMRC75H13H501O',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf658',
      'spotId': '585a8629-4c3f-44a2-b90f-dc1e13a23240',
      'code': '9/A',
      'description': '9A',
      'shift': 'C',
      'venueId': 'RM.1005',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'NTRMRN67E02H501G',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GRCMRC75B24D037M',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GBRCST63P10B496K',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FRTLRD87C24H501Y',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SLRGCM66D20G273G',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf659',
      'spotId': '2d50301e-8427-4921-a461-3ce75b4bc1b4',
      'code': '10/A',
      'description': '10/A',
      'shift': 'C',
      'venueId': 'RM.1006',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'CPPNRC64B04G547K',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CLLMRC70E12H501Q',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LCTDNL81T14H501O',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SPLSVT75C12F839D',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MRGMLN74L13H501C',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf65a',
      'spotId': '0c1e3eb5-edcd-4694-8a4c-fd1a5b52e5ed',
      'code': 'AB/10',
      'description': 'AB/10',
      'shift': 'C',
      'venueId': 'RM.1006',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'RCAMRC78H01H501R',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf65b',
      'spotId': 'edfcf08c-690d-43f4-8ec3-ee6d2d8642b7',
      'code': 'AG/10',
      'description': 'AG/10',
      'shift': 'C',
      'venueId': 'RM.1006',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'CHZRSE66S18D969Q',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CPPNRC64B04G547K',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf65c',
      'spotId': '992113bf-c667-448e-9922-16b7fa6f84a1',
      'code': '11/A',
      'description': '11/A',
      'shift': 'C',
      'venueId': 'RM.1007',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'ZVGMRA67E24H501L',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FBNSMN87T09H501I',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LBRLCU83P30H501U',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SFRLSS81M13E958F',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CSTNDR65D03F158H',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf65d',
      'spotId': 'dce67aea-d0b0-4cc4-a899-2a6a2aba4874',
      'code': 'A/TRID 11',
      'description': 'A/TRID 11',
      'shift': 'C',
      'venueId': 'RM.1007',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DNLSFN61H17G484V',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'ZVGMRA67E24H501L',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LBRLCU83P30H501U',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf65e',
      'spotId': '7fde676a-20ac-4003-b243-5bf3a933ddb5',
      'code': '12/A',
      'description': '12/A',
      'shift': 'C',
      'venueId': 'RM.1008',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MRNRST61L10H501P',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FTCCRL67L10C662K',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'TMSGLN58M18H501K',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FRTFNZ72H10H501W',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SNTSMN80E02H501L',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf65f',
      'spotId': '1632ec25-fd60-49a1-8a03-1745e852a973',
      'code': 'AS/12',
      'description': 'AS/12',
      'shift': 'C',
      'venueId': 'RM.1008',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'FRTFNZ72H10H501W',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MRTRNI79H19I234C',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf660',
      'spotId': 'a4b769c5-0824-4036-aa85-eea302e62472',
      'code': 'AB/12',
      'description': 'AB/12',
      'shift': 'C',
      'venueId': 'RM.1008',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'CRSLSS80L02H501T',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FRTFNZ72H10H501W',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf661',
      'spotId': 'a2a251d0-476a-4807-af89-963646110ba3',
      'code': '14/A',
      'description': '14/A',
      'shift': 'C',
      'venueId': 'RM.2007',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'NFRRML67C10I992V',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MNCTTL64R01I992U',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RLNGPR73E04I992Q',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'TCCRRT67R03L182W',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RPNLNZ71P01I992H',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf662',
      'spotId': '1585e0c6-adfd-4984-8589-d516305b30ca',
      'code': '15/A',
      'description': '15/A',
      'shift': 'C',
      'venueId': 'RM.2004',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MLCVNI63L20E958B',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SCRLCU76S18H501D',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CNLFNC84D19D972H',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RCCMRC87M23L719K',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PZZLCU75C04D773B',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf663',
      'spotId': '34d10606-b26b-42fd-8294-f0a0c87f53f9',
      'code': '16/A',
      'description': '16/A',
      'shift': 'C',
      'venueId': 'RM.2002',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'LSSSFN63M02I573Y',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MCHMTT81H04H501S',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CVLMRC80H20F839J',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CPRCRL64A27A449S',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RBCRRT83M21C858P',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf664',
      'spotId': 'ff4f201a-2fb1-49f3-89f7-3684bf13665d',
      'code': '17/A',
      'description': '17/A',
      'shift': 'C',
      'venueId': 'RM.2009',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PRSRRT63L16C773R',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CHLMNL79M30H501X',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SNTRCR82R21H501Z',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MDCCLL76P15H501Z',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LGRMSM85B26F839N',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf665',
      'spotId': 'bab5d75b-32b2-4f94-9f64-93a468033c12',
      'code': 'AS/17',
      'description': 'AS/17',
      'shift': 'C',
      'venueId': 'RM.1008',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'CTNLSS82H22H501U',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MRTRNI79H19I234C',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MRNRST61L10H501P',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf666',
      'spotId': '3951be7b-4173-4e95-b45e-a69208cb7b78',
      'code': '18/A',
      'description': '18/A',
      'shift': 'C',
      'venueId': 'RM.2008',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'DGSGFR63S03H819Q',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MSTMRA66E19L182Q',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GMBSMN71H23H501K',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LRAGPP67C31H501S',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'LRASFN72B07L182W',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf667',
      'spotId': 'c25bb5f0-3d4a-4fd1-8163-c53b810b89cb',
      'code': 'AB/19',
      'description': 'AB/19',
      'shift': 'C',
      'venueId': 'RM.2008',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'LRAGPP67C31H501S',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DLLGPP81T21F052U',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf668',
      'spotId': '287f5800-cd1e-49d2-9221-71993289eeeb',
      'code': 'ROSSO 1',
      'description': 'ROSSO 1',
      'shift': 'C',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PGLGLI68A23H501G',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PRNMLE63L26F660W',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf669',
      'spotId': '0ab9d4a1-e80a-4aa4-b071-e2a0fcedffcf',
      'code': '20/A',
      'description': '20/A',
      'shift': 'C',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'TAIPLA61E04H501C',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DSNSMN82C08E958G',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CLTNDR83R23H501W',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DSNGZN73S13H501R',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MLZDVD82E24H501Z',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf66a',
      'spotId': 'dec18266-2033-4d2a-8716-db03b65d653c',
      'code': 'DELTA-ASA',
      'description': 'DELTA-ASA',
      'shift': 'C',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'FRTMRZ60M22H501T',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRRMTT80B13H501S',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BVLDVD85E31H501T',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf66b',
      'spotId': '105102f3-c61e-4441-be1b-f3fc109cdb8a',
      'code': 'DELTA-2/ES',
      'description': 'DELTA-2/ES',
      'shift': 'C',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PRNMLE63L26F660W',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf66c',
      'spotId': '67288629-848c-47d7-996d-4faa2c19df4b',
      'code': 'DELTA-03/ES',
      'description': 'DELTA-03/ES',
      'shift': 'C',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'RDTMNL84L17E958G',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'VNGDVD83P14H501F',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PGLGLI68A23H501G',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf66d',
      'spotId': 'e60eb44b-d94e-4639-9e08-f0a8648c9e99',
      'code': 'OVEST-01',
      'description': 'OVEST-01',
      'shift': 'C',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PNDSCH84D13H264O',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'TAIPLA61E04H501C',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GNDMNL82C18H501O',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf66e',
      'spotId': '60de5308-15ec-4d27-8093-f6bf196a3f2c',
      'code': 'OVEST-02',
      'description': 'OVEST-02',
      'shift': 'C',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'CLBLSN84M03H501Q',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'VNGDVD83P14H501F',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PRNMLE63L26F660W',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf66f',
      'spotId': '6c5b23a9-949a-4360-bb7e-4e2261b200fc',
      'code': 'OVEST-03',
      'description': 'OVEST-03',
      'shift': 'C',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'TSSLSN72C04H501D',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'TAIPLA61E04H501C',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BRNFNC86L10H501L',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf670',
      'spotId': '4faa3d53-4708-4f59-a0c6-88cb015f1d6a',
      'code': 'EST-01',
      'description': 'EST-01',
      'shift': 'C',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PLTLCL80M26H792R',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'TDSSMN84B07H501I',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BRNFNC86L10H501L',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf671',
      'spotId': 'be2de8a2-33cf-4eb0-8afc-a0c8f0a3893e',
      'code': 'EST-02',
      'description': 'EST-02',
      'shift': 'C',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'TAIPLA61E04H501C',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'VCLFBA67D27H501L',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'NCRLSS72P28H501E',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf672',
      'spotId': '0084d1f4-7a69-4142-92ba-a839d9a5ca17',
      'code': 'EST-03',
      'description': 'EST-03',
      'shift': 'C',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'SNTLCU67D22H501B',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MLZDVD82E24H501Z',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FRRFNC66S22H5L1G',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf673',
      'spotId': '09635029-35ec-43ff-8dd7-8426b9037255',
      'code': 'FCO/CENTRALINO',
      'description': 'FCO/CENTRALINO',
      'shift': 'C',
      'venueId': 'RM.1501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'CLMMNL72E13H501D',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DSNGZN73S13H501R',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'VCLFBA67D27H501L',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf674',
      'spotId': '8f009679-5487-413a-b74c-95eb7715219f',
      'code': '21/A',
      'description': '21/A',
      'shift': 'C',
      'venueId': 'RM.2003',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'BNTSDR63D09C767B',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'NREMSM75P12H501D',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PCCLCU70S02D773K',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRQGLC68R11H501O',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FRNNGL71M03H501W',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf675',
      'spotId': 'd8f50952-fc54-49e3-9356-1d0173401906',
      'code': '22/A',
      'description': '22/A',
      'shift': 'C',
      'venueId': 'RM.2006',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MRNFBA67B03H501F',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRLFPP81T21G377S',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DNGSFN80P09H501M',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FBRMSM74R22H501K',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RNZFBA74E17H501N',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf676',
      'spotId': 'd0c7fbb9-fcd7-42fc-b5ad-bb8e6566bef3',
      'code': 'AS/22',
      'description': 'AS/22',
      'shift': 'C',
      'venueId': 'RM.2006',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MRNFBA67B03H501F',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRLFPP81T21G377S',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf677',
      'spotId': '027294fc-d177-4334-aeda-c0f36467b1a4',
      'code': 'AB/22',
      'description': 'AB/22',
      'shift': 'C',
      'venueId': 'RM.2006',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MRNFBA67B03H501F',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRLFPP81T21G377S',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf678',
      'spotId': '83cbcab8-32eb-453b-8baa-5263e602f864',
      'code': '23/A',
      'description': '23/A',
      'shift': 'C',
      'venueId': 'RM.2000',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'NNZPLA66B25F880O',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PTRDNL63B02E472I',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PTTRRT74P21Z133L',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MTTFRZ77S21A323N',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CLCMRA70P10E958I',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf679',
      'spotId': '5a291161-646b-4319-b495-bf3226932f52',
      'code': '24/A',
      'description': '24/A',
      'shift': 'C',
      'venueId': 'RM.2005',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MRZRRT80C07H501H',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRQRMN72E11L182Z',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CLZGLI69L04L219C',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CHCLSS80T14L182V',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DMNGCR64T20A515A',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf67a',
      'spotId': '75c17355-f4bd-4640-90fa-a8e31fce1f8b',
      'code': '25/A',
      'description': '25/A',
      'shift': 'C',
      'venueId': 'RM.2001',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'NRDMSM64D20B114Q',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RTNMRC70H27H501M',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RMNSTG72H26H501V',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PLDFNC77A29H501M',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'FRNFBA73H05H501V',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf67b',
      'spotId': 'c5b69a70-ceec-4d75-b67f-09fcfb7fc3c4',
      'code': '26/A',
      'description': '26/A',
      'shift': 'C',
      'venueId': 'RM.2015',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'FRGGRL65S06H501H',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MCHDNL82H26C773D',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MRNGPP67E30H501E',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CLBLSN74H03H501N',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'TRTNGL84R22C773Z',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf67c',
      'spotId': 'c95f72bf-e220-4a39-9944-08cce1d40cfb',
      'code': '27/A',
      'description': '27/A',
      'shift': 'C',
      'venueId': 'RM.2011',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'CPRGNN59R06H501C',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'GVNCST84B26D773H',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DBNLSS87M30H501H',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PMPMNL75A07L719V',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'MMNNDR77M20D972M',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf67d',
      'spotId': '3339fa11-03db-4a0e-8531-58060bf94e7c',
      'code': '31/A',
      'description': '31/A',
      'shift': 'C',
      'venueId': 'RM.2012',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'RNCPLA67C15H501C',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PLSMRZ73M16H501P',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PZZGMR68T06L840X',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CLASMN82B08H501W',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RSSRNT70L17H501X',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf67e',
      'spotId': '89822c91-77dd-48a7-ab2a-5209c2520628',
      'code': 'ROSSO 2',
      'description': 'ROSSO 2',
      'shift': 'C',
      'venueId': 'RM.1502',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'STFTTR79H02A345K',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BTTGNN68E12E958D',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf67f',
      'spotId': 'bb8eeafd-5b1d-4611-9832-964c449a87d4',
      'code': 'CPO/AIS-1',
      'description': 'CPO/AIS-1',
      'shift': 'C',
      'venueId': 'RM.1502',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MRTSMN82T25H501M',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PCNVTR65M09H501A',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'TSCSMN82E24H501R',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf680',
      'spotId': 'eec61179-4860-4d91-a76a-f3cfc0f3aa35',
      'code': 'CPO/AIS-2',
      'description': 'CPO/AIS-2',
      'shift': 'C',
      'venueId': 'RM.1502',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PCNVTR65M09H501A',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf681',
      'spotId': '73535385-d177-4c9a-9e0e-92c2332044e5',
      'code': 'CPO/AIS-3',
      'description': 'CPO/AIS-3',
      'shift': 'C',
      'venueId': 'RM.1502',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'RBNPLA64L17H501F',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'TMSGRL81R23H501Q',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf682',
      'spotId': 'f323482d-bfce-48e9-bed7-9d98bee95b62',
      'code': 'CPO/ASA',
      'description': 'CPO/ASA',
      'shift': 'C',
      'venueId': 'RM.1502',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MLEDNI67A17H501A',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PCNVTR65M09H501A',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf683',
      'spotId': '537a516b-852f-4c05-b152-c5d7c56c0c86',
      'code': 'CPO/CENTRALINO',
      'description': 'CPO/CENTRALINO',
      'shift': 'C',
      'venueId': 'RM.1502',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'PRCCRL65C06H501C',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PLNFBA63S26H501C',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf684',
      'spotId': 'ea55b7d6-91d5-4fe8-90e1-bfe5b0289d25',
      'code': 'CRRC',
      'description': 'CRRC',
      'shift': 'C',
      'venueId': 'RM.1552',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MSCNDR72R03H501C',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BRBLSN69E22H501J',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'DCLFRZ82T12H501I',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf685',
      'spotId': '60d256fb-db4e-4a98-87c0-be502ca74640',
      'code': 'TA/6',
      'description': 'TA/6',
      'shift': 'C',
      'venueId': 'RM.3100',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'MNTFNC76M26H501U',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'BNDMSM72M04H501S',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf686',
      'spotId': '4a6e4d5e-ec02-4133-b2c4-ed091c719a63',
      'code': 'SIERRA 1',
      'description': 'SIERRA 1',
      'shift': 'C',
      'venueId': 'RM.1551',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'FLCMDA70D23H501X',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RUIDRA67A11H501Y',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'RMNVCN60R17G273P',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'SPLCLD60M09H501K',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf687',
      'spotId': 'df7041ad-22e7-49b8-ab21-b29a3f254d47',
      'code': 'SIERRA 2',
      'description': 'SIERRA 2',
      'shift': 'C',
      'venueId': 'RM.1551',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'RMNVCN60R17G273P',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CRFSMN77C20H501G',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf688',
      'spotId': 'ffe02d9c-f3ae-4f5b-95db-69d5b931b92a',
      'code': 'SIERRA 3',
      'description': 'SIERRA 3',
      'shift': 'C',
      'venueId': 'RM.1551',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'SPLCLD60M09H501K',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf689',
      'spotId': '5a74b5bc-b5da-4c03-b336-cc880a915684',
      'code': 'SAF-01',
      'description': 'SAF-01',
      'shift': 'C',
      'venueId': 'RM.1012',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'SNZNDR69S21H501N',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    },
    {
    'id': '60c0d70c7675e329edbaf68a',
      'spotId': '1ffe10c1-4398-426d-8392-b685a1b84e5f',
      'code': 'M07',
      'description': 'M07',
      'shift': 'C',
      'venueId': 'RM.2501',
      'operationState': 'AVAILABLE',
      'vehiclesIds': null,
      'spotMembers': [
        {
        'userId': 'CCTGFR64H24G273Z',
          'role': 'TEAM_LEADER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'PRNGNN76P29H501S',
          'role': 'DRIVER',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'CSLRRT69E06L219B',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        },
        {
        'userId': 'VTLNGL61S10D024N',
          'role': 'ATTACHE',
          'presences': [
            {
            'from': '2021-06-09T06:00:00Z',
              'to': '2021-06-09T18:00:00Z'
            }
          ]
        }
      ],
      'spotType': 'WORKSHIFT',
      'start': '2021-06-10T18:00:00Z',
      'end': '2021-06-11T06:00:00Z',
      'version': 1,
      'createdAt': '2021-06-09T14:58:20.621Z',
      'enabled': true,
      'dne': 'NOTTURNO',
      'workshiftId': '60bf0f1edc198c3a145136b8',
      'workshiftVenueId': 'RM',
      'workshiftFrom': '2021-06-10T18:00:00Z',
      'workshiftTo': '2021-06-11T06:00:00Z',
      'workshiftShifts': [
        'C'
      ]
    }
  ]
}";
    }
}