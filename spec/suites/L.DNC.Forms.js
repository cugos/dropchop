describe("L.DNC.Forms", function () {
    var expectedOptions = {
        options: {
            maxFeatures: 1,
            additionalArgs: 0.1,
            description: 'Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.',
            parameters: [
                {
                    name: 'distance',
                    description: 'Distance to draw the buffer.',
                    type: 'number',
                    default: 10
                },
                {
                    name: 'unit',
                    type: 'select',
                    description: '',
                    options: ['miles', 'feet', 'kilometers', 'meters', 'degrees'],
                    default: 'miles'
                }
            ],
            createsLayer: true
        },
        paramArray: {
            0: 10,
            1: "miles"
        },
        title: "buffer"
    };

    
    // var expectedParameters = [Object, 10, "miles"];

    var geo = new L.DNC.Geo();
    var buffer = geo.buffer;
    var forms = new L.DNC.Forms();

    beforeEach(function () {
        form = forms.render('buffer', buffer);
    });

    describe('Initialize', function() {
        
        // ensure form operation objects passed properly
        it('Options passed', function (){
            expect( form.options ).to.eql( expectedOptions.options );
        });
    });


    // TODO: write submit tests
    // describe('Submit', function() {

    // })
});
