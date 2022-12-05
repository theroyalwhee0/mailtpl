document = _ stmts:statements+ _ { return stmts  }

statements = _ stmt:( string / attr ) _ { return stmt  }

attr =
	"attr(" name:attribute_name ")" { return { attr: name }  }
    
attribute_name    
	= name:[a-zA-Z0-9_\-]+ { return name.join(""); }

string
  = quotation_mark chars:char* quotation_mark { return chars.join(""); }

char
  = unescaped
  / escape
    sequence:(
        "'"
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    )
    { return sequence; }

escape
  = "\\"

quotation_mark
  = "'"

unescaped
  = [^\0-\x1F\x27\x5C]

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i

_ "whitespace" = [ \t\n\r]* { return '' }
