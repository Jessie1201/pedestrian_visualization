def get_zebras(a, b, c, n):
    for x in range(n):
        start = []
        end = []
        start.append(a[0] + (x + 1) * (c[0] - a[0])/(n))
        start.append(a[1] + (x + 1) * (c[1] - a[1])/(n))
        end.append(start[0] + b[0] - a[0])
        end.append(start[1] + b[1] - a[1])
        print str(start) + "," + str(end)

# get_zebras([18.063224920000003, 59.335602640000005],[18.063164597, 59.335665137999996], [18.063630298847826, 59.3357035368913], 22)
# get_zebras([18.063219416905927, 59.33553139337154], [18.06310800507686, 59.3355043734761],[18.06332333756404, 59.33542726421548], 11)
# get_zebras([18.063574122393632, 59.33534103086854],[18.063659496528416, 59.3352529905227],[18.064001722219146, 59.33544889028823], 23)
# get_zebras([18.063842435380604, 59.33571152184798],[18.06395894323627, 59.33573975949038],[18.06400580911104, 59.335556200250764],16)

def get_middle_coordinates(a, b):
    middle = []
    middle.append((a[0] + b[0])/2)
    middle.append((a[1] + b[1])/2)
    print middle

def get_positionbytime(a_appear, a_start, b_get):
    for x in range(a_start[2] - a_appear[2]):
            print str([a_appear[0], a_appear[1], x+1]) + ','
    t_move = b_get[2] - a_start[2]
    t = 0
    while t < t_move:
            x_new = a_start[0] + (b_get[0] - a_start[0]) * t / (b_get[2] - a_start[2])
            y_new = a_start[1] + (b_get[1] - a_start[1]) * t / (b_get[2] - a_start[2])
            print str([x_new, y_new, a_start[2] + t + 1]) + ','
            t += 1

get_positionbytime([18.063593368489585, 59.3352888431697, 0], [18.063593368489585, 59.3352888431697, 50], [18.064326010284873, 59.3355074345595, 420])

