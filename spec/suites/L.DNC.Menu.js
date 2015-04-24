describe("L.DNC.Menu >", function () {
    var menu = null;
    var title = "Test Menu";
    var fakeOptions = { foo: 'bar' };

    var begin_html =
        '<div class="menu">' +
          '<button class="menu-button">' +
            title +
            '<i class="fa fa-angle-down"></i>' +
          '</button>' +
          '<div class="menu-dropdown menu-expand">';
    var end_html =
          '</div>' +
        '</div>';
    var expected_html = begin_html + end_html;


    beforeEach(function () {
        menu = new L.DNC.Menu( title, fakeOptions );
    });

    describe("initialize options >", function () {

        it("is activated correctly >", function () {
            expect( menu instanceof L.DNC.Menu ).to.equal( true );
        });

        it("options correctly set >", function () {
            expect( menu.options ).to.eql( fakeOptions );
        });

        it("has title set >", function () {
            expect( menu.title ).to.equal( title );
        });
    });

    describe("dom element >", function () {

        it("can build dom element >", function () {
            expect( menu._buildDomElement ).to.be.ok;

            var generated_el = menu._buildDomElement();
            expect( generated_el instanceof HTMLElement) .to.equal( true );
            expect( generated_el.outerHTML ).to.eql( expected_html );
        });

        it("has dom element >", function () {
            expect( menu.domElement ).to.be.ok;
            expect( menu.domElement instanceof HTMLElement ).to.equal( true );
            expect( menu.domElement.outerHTML ).to.equal( expected_html );
        });
    });

    describe("public methods >", function (){

        it("has addTo >", function () {
            expect( menu.addTo ).to.be.ok;

            var parent = document.createElement( 'div' );
            menu.addTo(parent);

            expect( parent.outerHTML ).to.equal( '<div>' + expected_html + '</div>' );
        });

        it("has addChild >", function () {
            expect( menu.addChild ).to.be.ok;

            var child = document.createElement( 'div' );
            var innerHtml = "<b>This is probably where a button would be</b>";

            child.innerHTML = innerHtml;
            menu.addChild( { domElement: child } );
            expect( menu.domElement.outerHTML ).to.equal( begin_html + child.outerHTML + end_html );
        });

    });

    describe("menu dropdown >", function (){
        var dropdown;
        beforeEach(function () {
            dropdown = menu.domElement.getElementsByClassName('menu-dropdown')[0];
        });

        it("is unexpanded at start >", function () {
            expect(dropdown.classList.contains('expanded')).to.be.false;
        });

        it("expands upon click >", function () {
            menu.domElement.click();
            expect(dropdown.classList.contains('expanded')).to.be.true;
        });

        it("unexpanded upon double click >", function () {
            menu.domElement.click();
            menu.domElement.click();
            expect(dropdown.classList.contains('expanded')).to.be.false;
        });

        it("unexpands one menu when other menu is clicked >", function () {
            // Setup
            var menu2 = new L.DNC.Menu( "Second Menu" );
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

        // it("is not visible when not expanded >", function () {
        //     // TODO: Expect that dropdown is not visible
        //     // isVisible(dropdown)
        // });

        // it("is visible when expanded >", function () {
        //     menu.domElement.click();
        //     // TODO: Expect that dropdown is visible
        // });

    });
});
