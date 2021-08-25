module.exports = 
`
-
    movement:
        name: car_movement
        max_speed:
            min: 10
            max: 20
        max_acceleration:
            - 4
            - 5
            - 6
        max_turn: 2
-
    appearance:
        name: car_app
        type: cube
        length: 10
        width: 10
        height: 5
        color:
            - 1
            - 0
            - 0
            - 1
-
    role:
        name: car
        movement: car_movement
        appearance: car_app
-
    goal:
        location:
            - -974.3109916241956
            - 1020.3289020429365
            - 0.02
        name: goal_15303559858450.7889163766980238
        type: single
        goalIndex: '0'
        key: 0
        pointIndex: single
        orientation:[0,0,3]
-
    goal:
        script:
            - goal_15303559858450.7889163766980238
        name: goal_891433099458.3984
        type: path
-
    agent:
        role: car
        goal: goal_891433099458.3984
        name: car-2
        initlocation:
            - -974.0171952392266
            - 1036.824917417951
            - 0.4000000000000056
        initorient: 0
-
    goal:
        type: single
        location:
            - -977.1754248710931
            - 1029.12821622286
            - 0.001
        name: goal_15303559858450.4263233351612863
-
    goal:
        type: single
        script:
            - goal_15303559858450.4263233351612863
        name: goal_273580376692.87216
-
    agent:
        name: xg
        role: gplus
        goal: goal_273580376692.87216
        initlocation:
            - -979.1625292387034
            - 1036.3876438671723
            - 0.4
        initorient: 0
        scaleToLatitude: true
`;