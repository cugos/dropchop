describe("L.Dropchop.Menu", function () {
    var menu = null;
    var title = "Test Menu";
    var items = [];
    var parent = new L.Dropchop.MenuBar( { id: 'menu-bar' } );
    var fakeOptions = { items: ['waka', 'flaka'], menuDirection: 'below', expand: true };

    var begin_html =
        '<div class="menu">' +
          '<button class="menu-button">' +
            title +
            '<i class="fa fa-angle-down"></i>' +
          '</button>' +
          '<div class="menu-dropdown menu-expand">';
    var middle_html = '<button class="menu-button menu-button-action" id="waka">waka</button>' +
                      '<button class="menu-button menu-button-action" id="flaka">flaka</button>';
    var end_html =
          '</div>' +
        '</div>';
    var expected_html = begin_html + middle_html + end_html;


    beforeEach(function () {
        menu = new L.Dropchop.Menu( title, fakeOptions ).addTo( parent );
    });


    /*
    **
    **  Ensures all options passed through L.Dropchop.Menu are properly
    **  intialized in the app and equalt their expected values.
    **
    */
    describe("initialize options", function () {

        it("is activated correctly", function () {
            expect( menu instanceof L.Dropchop.Menu ).to.equal( true );
        });

        it("options correctly set", function () {
            expect( menu.options ).to.eql( fakeOptions );
        });

        it("has title set", function () {
            expect( menu.title ).to.equal( title );
        });

    });

    /*
    **
    **  Tests building the menu items, which returns an array of
    **  HTML elements in this.children
    **
    */
    describe("building menu items", function () {

        it("can build items", function() {
            expect( menu._buildMenuItems ).to.be.ok;

            items = menu._buildMenuItems(menu.options.items);
            expect( Array.isArray(items) ).to.equal( true );
            for ( var a = 0; a < items.length; a++ ) {
                expect( items[a] instanceof HTMLElement ).to.equal( true );
            }
        });
    });

    /*
    **
    **  Building the main DOM element
    **  This tests for HTML elements, and ensures the function
    **  is running properly with "items" from above.
    **
    */
    describe("dom element", function () {

        it("can build dom element", function () {
            expect( menu._buildDomElement ).to.be.ok;

            var generated_el = menu._buildDomElement( items );
            expect( generated_el instanceof HTMLElement).to.equal( true );
            expect( generated_el.outerHTML ).to.eql( expected_html );
        });

        it("has dom element", function () {
            expect( menu.domElement ).to.be.ok;
            expect( menu.domElement instanceof HTMLElement ).to.equal( true );
            expect( menu.domElement.outerHTML ).to.equal( expected_html );
        });
    });

    /*
    **
    **  Testing the dropdown/visibility functionality for menus.
    **  Create a second menu to test for menu closing when another
    **  has been clicked.
    **
    */
    describe("menu dropdown", function (){
        var dropdown;
        beforeEach(function () {
            dropdown = menu.domElement.getElementsByClassName('menu-dropdown')[0];
        });

        it("is unexpanded at start", function () {
            expect(dropdown.classList.contains('expanded')).to.be.false;
        });

        it("expands upon click", function () {
            menu.domElement.click();
            expect(dropdown.classList.contains('expanded')).to.be.true;
        });

        it("unexpanded upon double click", function () {
            menu.domElement.click();
            menu.domElement.click();
            expect(dropdown.classList.contains('expanded')).to.be.false;
        });

        it("unexpands one menu when other menu is clicked", function () {
            // Setup
            var menu2 = new L.Dropchop.Menu( "Second Menu", fakeOptions ).addTo( parent );
            var dropdown2 = menu2.domElement.getElementsByClassName('menu-dropdown')[0];
            document.body.appendChild(menu.domElement);
            document.body.appendChild(menu2.domElement);
            menu.domElement.click();
            expect(dropdown.classList.contains('expanded')).to.be.true;
            expect(dropdown2.classList.contains('expanded')).to.be.false;

            // Test
            menu2.domElement.click();
            expect(dropdown2.classList.contains('expanded')).to.be.true;
            expect(dropdown.classList.contains('expanded')).to.be.false;
        });

        it("is not visible when not expanded", function () {
            // TODO: Expect that dropdown is not visible
            // isVisible(dropdown)
        });

        it("is visible when expanded", function () {
            menu.domElement.click();
            // TODO: Expect that dropdown is visible
        });

    });
});
